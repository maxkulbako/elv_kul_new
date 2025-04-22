"use server";

import { prisma } from "../prisma";

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
    orderBy: {
      createdAt: "desc",
    },
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
  return { success: true, message: "Package created successfully" };
}
