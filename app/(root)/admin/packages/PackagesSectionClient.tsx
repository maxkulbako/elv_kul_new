import { Decimal } from "@prisma/client/runtime/library";
import PackageCard from "./PackageCard";
import { type IPackageCard } from "./PackageCard";

interface PackageTemplateProps {
  initialData: IPackageCard[];
  regularPrice: Decimal | undefined;
}

const PackagesSection = ({
  initialData,
  regularPrice,
}: PackageTemplateProps) => {
  if (initialData.length === 0) {
    return (
      <div className="flex justify-center items-center h-full">
        <p className="text-2xl font-bold">No packages found</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {initialData.map((pkg) => (
        <PackageCard
          key={pkg.id}
          packageData={pkg}
          regularPrice={regularPrice}
        />
      ))}
    </div>
  );
};

export default PackagesSection;
