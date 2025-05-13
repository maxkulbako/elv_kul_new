"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { format, startOfDay, endOfDay } from "date-fns";
import { Prisma } from "@prisma/client";

export async function scheduleAppointment(
  _prevState: unknown,
  formData: FormData,
): Promise<{
  success: boolean;
  message: string;
  requiresPayment?: boolean;
  clientSecret?: string;
  orderId?: string;
}> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const timeSlotId = formData.get("timeSlotId") as string;
  const clientId = formData.get("clientId") as string | undefined;

  // If clientId is provided (admin scheduling), use it, otherwise use the current user's ID
  const targetClientId = clientId || session.user.id;

  if (!targetClientId) {
    throw new Error("Client ID is required");
  }

  if (!timeSlotId) {
    return { success: false, message: "Time slot ID is required" };
  }

  try {
    // 1. Fetch the available slot and adminId
    const availableSlot = await prisma.availableSlot.findUnique({
      where: { id: timeSlotId, appointmentId: undefined },
      include: { admin: true },
    });

    if (!availableSlot) {
      return {
        success: false,
        message: "This time slot is no longer available.",
      };
    }

    if (!availableSlot.admin) {
      console.error(`Admin not found for available slot ${timeSlotId}`);
      return {
        success: false,
        message: "Admin associated with the slot not found.",
      };
    }

    const adminId = availableSlot.admin.id;

    // 2. Check if the client has an active package
    const now = new Date();
    const activePackage = await prisma.packagePurchase.findFirst({
      where: {
        clientId: targetClientId,
        status: "ACTIVE",
        sessionsUsed: { lt: prisma.packagePurchase.fields.sessionsTotal },
        endDate: { gte: startOfDay(now) },
      },
      orderBy: { endDate: "desc" },
      include: { packageTemplate: true },
    });

    if (activePackage) {
      // 3. Package found: Create Appointment and update PackagePurchase in a transaction
      try {
        await prisma.$transaction(async (tx) => {
          // 3.1 Create Appointment
          const createdAppointment = await tx.appointment.create({
            data: {
              date: availableSlot.date,
              durationMin: 50, // TODO: Think about it
              clientId: targetClientId,
              adminId: adminId,
              status: "PAID_FROM_PACKAGE",
              priceApplied: new Decimal(0),
              packagePurchaseId: activePackage.id,
              availableSlotId: availableSlot.id,
            },
          });

          // 3.2 Update the used sessions in the package
          const updatedPackage = await tx.packagePurchase.update({
            where: { id: activePackage.id },
            data: {
              sessionsUsed: {
                increment: 1,
              },
            },
          });

          // 3.3 Check if the package became expired after this session
          if (updatedPackage.sessionsUsed >= updatedPackage.sessionsTotal) {
            await tx.packagePurchase.update({
              where: { id: activePackage.id },
              data: { status: "EXPIRED" },
            });
          }

          // 3.4 Link the slot to the new Appointment (safer within transaction)
          await tx.availableSlot.update({
            where: { id: availableSlot.id },
            data: { appointmentId: createdAppointment.id },
          });

          return createdAppointment;
        });

        revalidatePath("/client/dashboard");
        revalidatePath("/client/appointments");
        revalidatePath("/admin/calendar");

        return {
          success: true,
          message: "Appointment scheduled successfully using your package.",
        };
      } catch (e) {
        console.error("Transaction failed when using package:", e);
        // TODO: Think about rolling back the status, if something went wrong inside the transaction
        // (although $transaction should do this automatically for DB errors)
        return {
          success: false,
          message: "Failed to use package for scheduling. Please try again.",
        };
      }
    } else {
      // --- Start Implementation for Individual Payment ---

      // 4.1 Determine the price
      let finalPrice: Decimal | null = null;
      //let pricingType: "GLOBAL_SINGLE" | "CLIENT_SINGLE" | null = null;

      // Check for client-specific price first
      const clientData = await prisma.user.findUnique({
        where: { id: targetClientId },
        select: { clientSpecialPrice: true },
      });

      if (
        clientData?.clientSpecialPrice &&
        clientData.clientSpecialPrice.greaterThan(0)
      ) {
        finalPrice = clientData.clientSpecialPrice;
        //pricingType = "CLIENT_SINGLE";
      } else {
        // If no client price, get global price
        const globalPriceData = await prisma.globalPricing.findFirst({
          orderBy: { validFrom: "desc" }, // Get the latest active global price
        });

        if (
          globalPriceData?.singlePrice &&
          globalPriceData.singlePrice.greaterThan(0)
        ) {
          finalPrice = globalPriceData.singlePrice;
          //pricingType = "GLOBAL_SINGLE";
        }
      }

      // Check if a price was determined
      if (!finalPrice) {
        console.error(
          `Could not determine price for client ${targetClientId} and no active package.`,
        );
        return {
          success: false,
          message:
            "Could not determine the appointment price. Please contact support.",
        };
      }

      // 4.2 Create Appointment (PENDING_PAYMENT) and Order within a transaction
      try {
        const { appointment, order } = await prisma.$transaction(async (tx) => {
          // Create Order first
          const createdOrder = await tx.order.create({
            data: {
              userId: targetClientId,
              type: "SINGLE_SESSION",
              amount: finalPrice as Decimal,
              currency: "UAH", // TODO: Or get from config/settings
              status: "PENDING",
              // paymentIntentId will be added after Stripe call
            },
          });

          // Create Appointment linking to the Order
          const createdAppointment = await tx.appointment.create({
            data: {
              date: availableSlot.date,
              durationMin: availableSlot.duration,
              clientId: targetClientId,
              adminId: adminId,
              status: "PENDING_PAYMENT",
              priceApplied: finalPrice as Decimal,
              orderId: createdOrder.id,
              availableSlotId: availableSlot.id,
              // packagePurchaseId remains null
            },
          });

          // Link slot (redundant, but ensures consistency if needed elsewhere)
          await tx.availableSlot.update({
            where: { id: availableSlot.id },
            data: { appointmentId: createdAppointment.id },
          });

          return { appointment: createdAppointment, order: createdOrder };
        });

        // 4.3 Initiate Payment with Stripe (outside the DB transaction)
        // This part requires integrating the Stripe SDK
        /*
         try {
            const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!); // Initialize Stripe

            const paymentIntent = await stripe.paymentIntents.create({
                amount: finalPrice.mul(100).toNumber(), // Amount in cents
                currency: order.currency.toLowerCase(),
                metadata: {
                    orderId: order.id,
                    appointmentId: appointment.id,
                    userId: targetClientId,
                },
                // Add customer ID if you manage customers in Stripe
                // customer: stripeCustomerId,
            });

            // 4.4 Update Order with Payment Intent ID
            await prisma.order.update({
                where: { id: order.id },
                data: { paymentIntentId: paymentIntent.id }
            });

            revalidatePath("/client/dashboard");
            revalidatePath("/client/appointments");
            revalidatePath("/admin/calendar");

            // Return client secret to the frontend to confirm the payment
            return {
                success: true,
                message: "Appointment pending payment.",
                requiresPayment: true,
                clientSecret: paymentIntent.client_secret,
                orderId: order.id
            };

         } catch (stripeError) {
             console.error("Stripe Payment Intent creation failed:", stripeError);
             // TODO: Consider how to handle this - maybe mark order/appointment as failed?
             return { success: false, message: "Failed to initiate payment process. Please try again." };
         }
         */
        // --- Placeholder until Stripe is integrated ---
        console.log(
          `Order ${order.id} and Appointment ${appointment.id} created with PENDING status. Price: ${finalPrice}`,
        );

        revalidatePath("/client/dashboard");
        revalidatePath("/client/appointments");
        revalidatePath("/admin/calendar");

        return {
          success: true,
          message:
            "Appointment created, pending payment (Stripe integration needed).",
          requiresPayment: true,
          orderId: order.id,
        };
      } catch (e) {
        console.error("Transaction failed for individual payment:", e);
        // Handle specific errors like unique constraint on slot again
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code === "P2002"
        ) {
          return {
            success: false,
            message: "This time slot was just booked. Please select another.",
          };
        }
        return {
          success: false,
          message: "Failed to schedule appointment. Please try again.",
        };
      }
    }
  } catch (error) {
    console.error("Error scheduling appointment:", error);
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "This time slot was just booked. Please select another.",
      };
    }
    return { success: false, message: "An unexpected error occurred." };
  }
}

export async function cancelAppointment(
  _prevState: unknown,
  formData: FormData,
) {
  const appointmentId = formData.get("appointmentId") as string;

  try {
    // Find the appointment and include related availableSlot
    const appointment = await prisma.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        availableSlot: true,
      },
    });

    if (!appointment) {
      return {
        success: false,
        message: "Appointment not found",
      };
    }

    await prisma.availableSlot.update({
      where: { id: appointment.availableSlot?.id },
      data: { appointmentId: null },
    });

    // Then update the appointment status
    await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        status: "CANCELLED",
        availableSlotId: null,
        updatedAt: new Date(),
      },
    });

    // Revalidate UI
    revalidatePath("/client/dashboard");
    revalidatePath("/client/appointments");
    revalidatePath("/admin/calendar");

    return { success: true, message: "Appointment cancelled successfully" };
  } catch (error) {
    console.error("Error cancelling appointment:", error);
    return {
      success: false,
      message: "Error cancelling appointment",
    };
  }
}

export async function getCalendarAppointments() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const appointments = await prisma.appointment.findMany({
    where: {
      clientId: session.user.id,
    },
    orderBy: {
      date: "asc",
    },
  });

  return appointments.map((appointment) => ({
    id: appointment.id,
    durationMin: appointment.durationMin,
    status: appointment.status,
    link: appointment.link,
    date: appointment.date.toISOString(),
  }));
}

export async function getClientAppointments() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const appointments = await prisma.appointment.findMany({
    where: {
      clientId: session.user.id,
      date: {
        gte: new Date(),
      },
      status: {
        notIn: ["CANCELLED", "COMPLETED"],
      },
    },
    select: {
      id: true,
      date: true,
      durationMin: true,
      status: true,
      orderId: true,
    },
    orderBy: {
      date: "asc",
    },
  });

  return appointments;
}

export async function getPastAppointments() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const appointments = await prisma.appointment.findMany({
    where: {
      clientId: session.user.id,
      date: {
        lt: new Date(),
      },
    },
    orderBy: {
      date: "desc",
    },
  });

  return appointments;
}

export async function getNextAppointment() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const appointment = await prisma.appointment.findFirst({
    where: {
      clientId: session.user.id,
      date: {
        gte: new Date(),
      },
      status: {
        notIn: ["CANCELLED", "COMPLETED"],
      },
    },
    orderBy: {
      date: "asc",
    },
  });

  return appointment;
}

export async function getTotalSessions(): Promise<number> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const count = await prisma.appointment.count({
    where: {
      clientId: session.user.id,
    },
  });

  return count;
}

// TODO: refactor to get the balance from the db
export async function getOutstandingBalance(): Promise<number> {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const payments = await prisma.payment.findMany({
    where: {
      clientId: session.user.id,
    },
  });

  const balance = payments.reduce((total, payment) => {
    return total + Number(payment.amount);
  }, 0);

  return balance;
}

export async function getCurrentSessionPackage() {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const activePackage = await prisma.clientPricing.findFirst({
    where: {
      clientId: session.user.id,
      isActive: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return activePackage;
}

export async function getAvailableSlots(date: Date) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  // Get admin user
  const admin = await prisma.user.findFirst({
    where: { role: "ADMIN" },
  });

  if (!admin) throw new Error("Admin not found");

  const timeSlots = await prisma.availableSlot.findMany({
    where: {
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
      adminId: admin.id,
      appointmentId: null,
    },
    orderBy: {
      date: "asc",
    },
  });

  const availableSlots = timeSlots.map((slot) => ({
    timeSlotId: slot.id,
    time: format(slot.date, "h:mm a"),
  }));

  return availableSlots;
}
