"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { Decimal } from "@prisma/client/runtime/library";
import { combineDateAndTime } from "@/lib/utils";
import { revalidatePath } from "next/cache";

export async function scheduleAppointment(
  _prevState: unknown,
  formData: FormData
) {
  const session = await auth();

  if (!session) throw new Error("Unauthorized");
  if (!formData.get("date")) throw new Error("Date is required");

  // Format the date and time
  const finalDate = combineDateAndTime(
    formData.get("date") as string,
    formData.get("time") as string
  );

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

  // 4. Create the appointment
  await prisma.appointment.create({
    data: {
      date: new Date(finalDate),
      durationMin: 50,
      clientId: session.user.id,
      adminId: admin.id,
      price: finalPrice,
      paymentStatus: "PENDING",
      status: "SCHEDULED",
      pricingType,
    },
  });

  // Revalidate the client dashboard page
  revalidatePath("/client/dashboard");

  return { success: true, message: "Appointment scheduled successfully" };
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
