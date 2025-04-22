import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import PackagesSection from "./PackagesSection";
import GlobalPriceSection from "./GlobalPriceSection";
import CreatePackageDialog from "./CreatePackageDialog";

const ServicePackagesPage: React.FC = async () => {
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Service Packages</h1>
              <p className="text-muted-foreground">
                Create and manage therapy session packages
              </p>
            </div>
            <Button
              className="bg-olive-primary hover:bg-olive-primary/90"
              // onClick={() => setIsAddingPackage(true)}
              asChild
            >
              <CreatePackageDialog />
            </Button>
          </div>
          <GlobalPriceSection />
          <PackagesSection />
        </div>
      </div>
    </div>
  );
};

export default ServicePackagesPage;
