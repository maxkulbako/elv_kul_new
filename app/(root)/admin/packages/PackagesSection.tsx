import {
  getPackageTemplates,
  getGlobalPrice,
} from "@/lib/actions/price.action";
import PackagesSectionClient from "./PackagesSectionClient";

export default async function PackagesSection() {
  const templates = await getPackageTemplates();
  const regularPrice = await getGlobalPrice();

  return (
    <PackagesSectionClient
      initialData={templates}
      regularPrice={regularPrice?.singlePrice}
    />
  );
}
