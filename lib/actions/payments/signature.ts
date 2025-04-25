import crypto from "crypto";

export function buildSignatureString(
  configItems: (string | number)[],
  productNames: string[],
  productCounts: number[],
  productPrices: string[],
): string {
  // “;”–delimited sequence in WfP spec
  return [
    ...configItems.map(String),
    ...productNames,
    ...productCounts.map(String),
    ...productPrices,
  ].join(";");
}

export function computeSignature(str: string, secretKey: string): string {
  return crypto.createHmac("md5", secretKey).update(str, "utf-8").digest("hex");
}
