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
  const DEFAULT_PRICE = new Decimal(50); // REFACTOR: get from global pricing

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

export async function getClientAppointments({
  clientId,
}: {
  clientId: string;
}) {
  const appointments = await prisma.appointment.findMany({
    where: {
      clientId,
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
