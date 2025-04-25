import GlobalPriceSectionClient from "./GlobalPriceSectionClient";
import { getGlobalPrice } from "@/lib/actions/price.action";

export default async function GlobalPriceSection() {
  const singlePrice = await getGlobalPrice();
  return (
    <GlobalPriceSectionClient
      initialPrice={Number(singlePrice?.singlePrice || 0)}
    />
  );
}
