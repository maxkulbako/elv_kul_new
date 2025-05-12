export interface WayForPayConfig {
  merchantAccount: string;
  secretKey: string;
  domain: string;
  appUrl: string;
  ngrokUrl?: string;
}

export function getWfpConfig(): WayForPayConfig {
  const merchantAccount = process.env.WAYFORPAY_MERCHANT_ACCOUNT;
  const secretKey = process.env.WAYFORPAY_SECRET_KEY;
  const rawDomain = process.env.NEXT_PUBLIC_APP_URL;
  const ngrokUrl = process.env.NGROK_URL; // TODO: create normal for production

  if (!merchantAccount || !secretKey || !rawDomain) {
    throw new Error("Missing WayForPay configuration in env");
  }

  // save domain without https://
  const domain = rawDomain.replace(/^https?:\/\//, "");
  return { merchantAccount, secretKey, domain, appUrl: rawDomain, ngrokUrl };
}
