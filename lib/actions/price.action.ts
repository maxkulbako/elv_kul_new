"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "../prisma";
import { Prisma } from "@prisma/client";
import { auth } from "@/auth";

export async function getGlobalPrice() {
  const globalPrice = await prisma.globalPricing.findFirst({
    orderBy: {
      validFrom: "desc",
    },
    select: {
      singlePrice: true,
    },
  });
  return globalPrice;
}

export async function updateGlobalPrice(formData: FormData) {
  const price = formData.get("singlePrice");

  if (!price || Array.isArray(price)) {
    return { success: false, message: "singlePrice is required" };
  }

  const singlePrice = Number(price);

  if (isNaN(singlePrice) || singlePrice < 0) {
    return {
      success: false,
      message: "singlePrice must be non‑negative number",
    };
  }
  await prisma.globalPricing.create({
    data: { singlePrice },
  });

  return { success: true, message: "Price updated successfully" };
}

export async function getPackageTemplates() {
  const packageTemplates = await prisma.packageTemplate.findMany({
    orderBy: [
      {
        isActive: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return packageTemplates;
}

export async function createPackageTemplateAction(formData: FormData) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sessionsTotal = Number(formData.get("sessionsTotal"));
  const price = Number(formData.get("price"));
  const validDays = Number(formData.get("validDays"));
  const validFrom = formData.get("validFrom") as string;

  if (!name || isNaN(sessionsTotal) || isNaN(price) || isNaN(validDays))
    return { success: false, message: "Invalid data" };

  await prisma.packageTemplate.create({
    data: {
      name,
      description,
      sessionsTotal,
      price,
      validDays,
      validFrom: validFrom ? new Date(validFrom) : undefined,
    },
  });

  revalidatePath("/admin/packages");

  return { success: true, message: "Package created successfully" };
}

export async function getPackageTemplateById(id: string) {
  if (!id) return null;
  const packageTemplate = await prisma.packageTemplate.findUnique({
    where: { id },
  });

  return packageTemplate
    ? {
        ...packageTemplate,
        price: Number(packageTemplate.price),
        description: packageTemplate.description || "",
      }
    : null;
}

export async function updatePackageTemplateStatusAction(
  id: string,
  isActive: boolean,
) {
  try {
    await prisma.packageTemplate.update({
      where: { id },
      data: { isActive: !isActive },
    });

    revalidatePath("/admin/packages");

    return { success: true, message: "Package status updated successfully" };
  } catch (error) {
    console.error("Error updating package status:", error);
    return { success: false, message: "Failed to update package status" };
  }
}

export async function updatePackageTemplateAction(
  id: string,
  formData: FormData,
) {
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const sessionsTotal = Number(formData.get("sessionsTotal"));
  const price = Number(formData.get("price"));
  const validDays = Number(formData.get("validDays"));
  const validFrom = formData.get("validFrom") as string;

  if (!name || isNaN(sessionsTotal) || isNaN(price) || isNaN(validDays))
    return { success: false, message: "Invalid data" };

  await prisma.$transaction(async (tx) => {
    await tx.packageTemplate.update({
      where: { id },
      data: {
        isActive: false,
      },
    });

    await tx.packageTemplate.create({
      data: {
        name,
        description,
        sessionsTotal,
        price,
        validDays,
        validFrom: validFrom ? new Date(validFrom) : undefined,
      },
    });
  });

  revalidatePath("/admin/packages");

  return { success: true, message: "Package updated successfully" };
}

export async function getAvailablePackages() {
  const availablePackages = await prisma.packageTemplate.findMany({
    where: { isActive: true },
    orderBy: {
      price: "asc",
    },
  });

  return availablePackages.map((pkg) => ({
    ...pkg,
    price: Number(pkg.price),
  }));
}

export type AvailablePackageTemplate = Prisma.PromiseReturnType<
  typeof getAvailablePackages
>[number];

export async function purchasePackegeAction(
  packageTemplateId: string,
): Promise<{ success: boolean; message: string; orderId?: string }> {
  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return { success: false, message: "Unauthorized" };
  }

  if (!packageTemplateId) {
    return { success: false, message: "Package Template ID is required." };
  }

  try {
    // 1. Fetch the package template to ensure it exists and is active
    const packageTemplate = await prisma.packageTemplate.findUnique({
      where: { id: packageTemplateId, isActive: true },
    });

    if (!packageTemplate) {
      return {
        success: false,
        message: "This package is no longer available or does not exist.",
      };
    }

    // --- NEW CHECK: Verify if user already has an ACTIVE package ---
    const activePurchase = await prisma.packagePurchase.findFirst({
      where: {
        clientId: userId,
        status: "ACTIVE", // Check specifically for ACTIVE status
      },
    });

    if (activePurchase) {
      // If an active package exists, prevent purchasing a new one
      return {
        success: false,
        message:
          "You already have an active package. You can purchase a new one after the current package expires or is fully used.",
      };
    }
    // --- End NEW CHECK ---

    // 2. (Optional Check) Prevent buying if already have a PENDING purchase
    const pendingPurchase = await prisma.packagePurchase.findFirst({
      where: {
        clientId: userId,
        status: "PENDING",
      },
    });
    if (pendingPurchase) {
      return {
        success: false,
        message:
          "You already have a pending order for the package. Please complete or cancel it.",
      };
    }

    // 3. Create Order and PackagePurchase in a transaction (only if no active package found)
    const { order } = await prisma.$transaction(async (tx) => {
      // 3.1 Create the Order
      const createdOrder = await tx.order.create({
        data: {
          userId: userId,
          type: "PACKAGE",
          amount: packageTemplate.price,
          currency: "UAH", // TODO: Make configurable
          status: "PENDING",
        },
      });

      // 3.2 Create the Package Purchase record
      await tx.packagePurchase.create({
        data: {
          clientId: userId,
          packageTemplateId: packageTemplate.id,
          sessionsTotal: packageTemplate.sessionsTotal,
          status: "PENDING",
          orderId: createdOrder.id,
        },
      });

      return { order: createdOrder };
    });

    // 4. Revalidate the path to update the UI
    revalidatePath("/client/packages");

    return {
      success: true,
      message:
        "Package added to your orders. Proceed to 'My Orders' to complete payment.",
      orderId: order.id,
    };
  } catch (error) {
    console.error("Error purchasing package:", error);

    //TODO: Handle specific error messages
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      return {
        success: false,
        message: error.message,
      };
    }
    return {
      success: false,
      message: "An unexpected error occurred while processing your request.",
    };
  }
}

export async function getOrdersByClientId(userId: string) {
  if (!userId) {
    throw new Error("User ID is required to fetch orders.");
  }

  const orders = await prisma.order.findMany({
    where: {
      userId: userId,
    },
    include: {
      packagePurchase: {
        include: {
          packageTemplate: {
            select: { name: true },
          },
        },
      },
      appointment: {
        select: { date: true },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return orders.map((order) => ({
    id: order.id,
    createdAt: order.createdAt,
    type: order.type,
    amount: order.amount.toNumber(),
    currency: order.currency,
    status: order.status,
    details:
      order.type === "PACKAGE"
        ? (order.packagePurchase?.packageTemplate?.name ?? "Package")
        : order.type === "SINGLE_SESSION"
          ? `Session on ${order.appointment ? new Date(order.appointment.date).toLocaleString() : "N/A"}`
          : "Unknown Order",
    paymentIntentId: order.paymentIntentId,
  }));
}

export async function getOrderDetailsById(orderId: string) {
  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: {
      packagePurchase: {
        include: {
          packageTemplate: true,
        },
      },
      appointment: true,
    },
  });
  return order;
}

export type UserOrder = Prisma.PromiseReturnType<
  typeof getOrdersByClientId
>[number];

export async function cancelPendingOrderAction({
  orderId,
  system,
}: {
  orderId: string;
  system: boolean;
}): Promise<{ success: boolean; message: string }> {
  console.log("🚀 Starting order cancellation process:", { orderId, system });

  const session = await auth();
  const userId = session?.user?.id;
  console.log("👤 User session:", { userId, isSystem: system });

  if (!userId && !system) {
    console.log("❌ Authorization failed: No user ID and not a system call");
    return { success: false, message: "Unauthorized" };
  }
  if (!orderId) {
    console.log("❌ Validation failed: No order ID provided");
    return { success: false, message: "Order ID is required." };
  }

  try {
    console.log("🔄 Starting database transaction");
    const result = await prisma.$transaction(async (tx) => {
      // 1. Find the order and verify ownership and status
      console.log("🔍 Fetching order details:", orderId);
      const order = await tx.order.findUnique({
        where: { id: orderId },
        include: {
          packagePurchase: { select: { id: true } },
          appointment: { select: { id: true, availableSlotId: true } },
        },
      });

      console.log("📦 Order details:", {
        found: !!order,
        userId: order?.userId,
        status: order?.status,
        type: order?.type,
        hasPackagePurchase: !!order?.packagePurchase,
        hasAppointment: !!order?.appointment,
      });

      // Check if order exists and belongs to the user
      if (!order) {
        console.log("❌ Order not found:", orderId);
        throw new Error("Order not found.");
      }
      if (order.userId !== userId && !system) {
        console.log("❌ Permission denied:", {
          orderUserId: order.userId,
          currentUserId: userId,
        });
        throw new Error("You do not have permission to cancel this order.");
      }

      // Check if the order is actually pending
      if (order.status !== "PENDING" && !system) {
        console.log("❌ Invalid order status:", {
          currentStatus: order.status,
          requiredStatus: "PENDING",
        });
        throw new Error(
          `No permission to cancel order with status: ${order.status}`,
        );
      }

      // 2. Update the Order status
      if (!system) {
        console.log("📝 Updating order status to CANCELLED");
        await tx.order.update({
          where: { id: orderId },
          data: { status: "CANCELLED" },
        });
      }

      // 3. Update related entities based on order type
      if (order.type === "PACKAGE" && order.packagePurchase) {
        console.log("📦 Processing package purchase cancellation");
        // Cancel the related PackagePurchase
        await tx.packagePurchase.update({
          where: { id: order.packagePurchase.id },
          data: { status: "CANCELLED" },
        });
        console.log("✅ Package purchase cancelled successfully");
      } else if (order.type === "SINGLE_SESSION" && order.appointment) {
        console.log("📅 Processing appointment cancellation");
        // Cancel the related Appointment
        const appointment = await tx.appointment.findUnique({
          where: { id: order.appointment.id },
          include: { availableSlot: true },
        });

        console.log("📊 Appointment status:", {
          id: appointment?.id,
          status: appointment?.status,
          hasAvailableSlot: !!appointment?.availableSlot,
        });

        if (
          appointment?.status === "PAID" ||
          appointment?.status === "PENDING_PAYMENT"
        ) {
          console.log("💰 Cancelling paid or pending payment appointment");
          await tx.appointment.update({
            where: { id: order.appointment.id },
            data: {
              status: "CANCELLED",
              availableSlotId: null,
              updatedAt: new Date(),
            },
          });
        } else if (appointment?.status === "COMPLETED") {
          console.log("✅ Cancelling completed appointment with refund");
          await tx.appointment.update({
            where: { id: order.appointment.id },
            data: {
              status: "COMPLETED_AND_REFUNDED",
              availableSlotId: null,
              updatedAt: new Date(),
            },
          });
        }

        // Free up the associated AvailableSlot if it exists
        if (order.appointment.availableSlotId) {
          console.log(
            "🕒 Freeing up available slot:",
            order.appointment.availableSlotId,
          );
          await tx.availableSlot.update({
            where: { id: order.appointment.availableSlotId },
            data: { appointmentId: null },
          });
          console.log("✅ Available slot freed successfully");
        }
      }

      console.log("✅ Transaction completed successfully");
      return { success: true, message: "Order cancelled successfully." };
    }); // End of transaction

    // 4. Revalidate paths after successful transaction
    console.log("🔄 Revalidating paths");
    revalidatePath("/client/packages");
    revalidatePath("/client/appointments");
    console.log("✅ Paths revalidated");

    return result;
  } catch (error) {
    console.error("❌ Error in cancellation process:", {
      error,
      message: error instanceof Error ? error.message : "Unknown error",
      stack: error instanceof Error ? error.stack : undefined,
    });
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Failed to cancel order.",
    };
  }
}
