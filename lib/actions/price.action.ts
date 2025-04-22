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
