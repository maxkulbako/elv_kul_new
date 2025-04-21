"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";
import { combineDateAndTime } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import { format, startOfDay, endOfDay } from "date-fns";

export async function scheduleAppointment(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();

  if (!session) throw new Error("Unauthorized");
  if (!formData.get("date") || !formData.get("timeSlotId"))
    return {
      success: false,
      message: "Date and time slot are required",
    };

  try {
    const appointmentId = formData.get("appointmentId") as string | null;

    // If the appointment is being rescheduled, update the status
    if (appointmentId) {
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: {
          status: "RESCHEDULED",
          availableSlotId: null,
          updatedAt: new Date(),
        },
      });
      await prisma.availableSlot.update({
        where: { appointmentId: appointmentId },
        data: { appointmentId: null },
      });
    }

    // 1. Fetch the global single pricing
    const globalPricing = await prisma.globalPricing.findFirst({
      orderBy: { validFrom: "desc" }, // most recent
    });

    // 2. Define the final price
    const DEFAULT_PRICE = new Decimal(50); // TODO: get from global pricing

    const finalPrice =
      globalPricing?.singlePrice && globalPricing.singlePrice.gt(0)
        ? globalPricing.singlePrice
        : DEFAULT_PRICE;

    const pricingType = "GLOBAL_SINGLE";

    // 3. Get admin user (since we only have one admin)
    const admin = await prisma.user.findFirst({
      where: { role: "ADMIN" },
    });

    if (!admin) throw new Error("Admin not found");

    // 4. Find available slot
    const availableSlot = await prisma.availableSlot.findFirst({
      where: { id: formData.get("timeSlotId") as string },
    });

    if (!availableSlot) {
      return {
        success: false,
        message: "This time slot is no longer available.",
      };
    }

    // 5. Create the appointment
    const appointment = await prisma.appointment.create({
      data: {
        date: availableSlot.date,
        durationMin: 50,
        clientId: session.user.id,
        adminId: admin.id,
        price: finalPrice,
        paymentStatus: "PENDING",
        status: "SCHEDULED",
        availableSlotId: availableSlot.id,
        pricingType,
      },
    });

    // 5.Link the slot
    await prisma.availableSlot.update({
      where: { id: availableSlot.id },
      data: {
        appointmentId: appointment.id,
      },
    });

    // Revalidate the client dashboard and appointments page
    revalidatePath("/client/dashboard");
    revalidatePath("/client/appointments");

    return {
      success: true,
      message: appointmentId
        ? "Appointment rescheduled successfully"
        : "Appointment scheduled successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Error scheduling appointment",
    };
  }
}

export async function cancelAppointment(
  _prevState: unknown,
  formData: FormData
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

  // Convert Decimal price to number
  return appointments.map((appointment) => ({
    ...appointment,
    price: Number(appointment.price),
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
  console.log("past appointments", appointments);
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
