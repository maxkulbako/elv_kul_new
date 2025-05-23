import { Prisma } from "@prisma/client";

export async function getSingleSessionPrice(
  tx: Prisma.TransactionClient,
  clientId: string,
) {
  // 1) ClientPricing (active)
  const clientPrice = await tx.clientPricing.findFirst({
    where: { clientId, isActive: true },
    orderBy: { validFrom: "desc" },
  });
  if (clientPrice) return clientPrice.price;

  // 2) GlobalPricing
  const global = await tx.globalPricing.findFirst({
    orderBy: { validFrom: "desc" },
  });
  if (!global) throw new Error("Global pricing not configured");
  return global.singlePrice;
}
