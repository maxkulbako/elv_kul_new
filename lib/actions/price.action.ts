"use server";

import { revalidatePath } from "next/cache";
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
    orderBy: [
      {
        isActive: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  return packageTemplates.map((template) => ({
    ...template,
    price: Number(template.price),
  }));
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
  isActive: boolean
) {
  try {
    await prisma.packageTemplate.update({
      where: { id },
      data: { isActive: !isActive },
    });

    revalidatePath("/admin/packages");

    return { success: true, message: "Package status updated successfully" };
  } catch (error) {
    return { success: false, message: "Failed to update package status" };
  }
}

export async function updatePackageTemplateAction(
  id: string,
  formData: FormData
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
