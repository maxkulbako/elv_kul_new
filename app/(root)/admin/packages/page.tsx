import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import PackagesSection from "./PackagesSection";
import GlobalPriceSection from "./GlobalPriceSection";

// Add global pricing state
const ServicePackagesPage: React.FC = () => {
  //   const [newPackage, setNewPackage] = useState({
  //     name: "",
  //     description: "",
  //     sessions: 0,
  //     regularPrice: 0,
  //     packagePrice: 0,
  //     validityPeriod: "",
  //   });
  //   const [isAddingPackage, setIsAddingPackage] = useState(false);

  //   const handleNewPackageChange = (
  //     e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  //   ) => {
  //     const { name, value } = e.target;
  //     setNewPackage((prev) => ({
  //       ...prev,
  //       [name]:
  //         name === "sessions" ||
  //         name === "regularPrice" ||
  //         name === "packagePrice"
  //           ? Number(value)
  //           : value,
  //     }));
  //   };

  //   const handleAddPackage = () => {
  //     // In a real app, you would send this to an API
  //     console.log("Adding package:", newPackage);

  //     // Reset the form and close the dialog
  //     setNewPackage({
  //       name: "",
  //       description: "",
  //       sessions: 0,
  //       regularPrice: 0,
  //       packagePrice: 0,
  //       validityPeriod: "",
  //     });
  //     setIsAddingPackage(false);
  //   };

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
            >
              <Plus className="h-4 w-4 mr-2" />
              Create New Package
            </Button>
          </div>

          {/* Add Global Price Management Card */}
          <GlobalPriceSection />

          {/* Add Packages Section */}
          <PackagesSection />
        </div>
      </div>
      {/* <Dialog open={isAddingPackage} onOpenChange={setIsAddingPackage}>
        <DialogTrigger asChild>
          <Button className="bg-olive-primary hover:bg-olive-primary/90">
            <Plus className="h-4 w-4 mr-2" />
            Create New Package
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Create New Service Package</DialogTitle>
            <DialogDescription>
              Set up a new package with special pricing for your therapy
              services.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Package Name
              </label>
              <Input
                id="name"
                name="name"
                value={newPackage.name}
                onChange={handleNewPackageChange}
                placeholder="e.g., Premium Therapy Package"
              />
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                name="description"
                value={newPackage.description}
                onChange={handleNewPackageChange}
                placeholder="Describe what's included in this package..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="sessions" className="text-sm font-medium">
                  Number of Sessions
                </label>
                <Input
                  id="sessions"
                  name="sessions"
                  type="number"
                  min={1}
                  value={newPackage.sessions || ""}
                  onChange={handleNewPackageChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="validityPeriod" className="text-sm font-medium">
                  Validity Period
                </label>
                <Input
                  id="validityPeriod"
                  name="validityPeriod"
                  value={newPackage.validityPeriod}
                  onChange={handleNewPackageChange}
                  placeholder="e.g., 3 months"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="regularPrice" className="text-sm font-medium">
                  Regular Session Price ($)
                </label>
                <Input
                  id="regularPrice"
                  name="regularPrice"
                  type="number"
                  min={0}
                  value={newPackage.regularPrice || ""}
                  onChange={handleNewPackageChange}
                />
              </div>
              <div className="grid gap-2">
                <label htmlFor="packagePrice" className="text-sm font-medium">
                  Package Total Price ($)
                </label>
                <Input
                  id="packagePrice"
                  name="packagePrice"
                  type="number"
                  min={0}
                  value={newPackage.packagePrice || ""}
                  onChange={handleNewPackageChange}
                />
              </div>
            </div>

            {newPackage.regularPrice > 0 &&
              newPackage.packagePrice > 0 &&
              newPackage.sessions > 0 && (
                <div className="bg-olive-light p-3 rounded-md text-sm">
                  <span className="font-medium">Savings:</span> $
                  {
                    calculateSavings(
                      newPackage.regularPrice,
                      newPackage.sessions,
                      newPackage.packagePrice
                    ).amount
                  }
                  (
                  {
                    calculateSavings(
                      newPackage.regularPrice,
                      newPackage.sessions,
                      newPackage.packagePrice
                    ).percentage
                  }
                  % off)
                </div>
              )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingPackage(false)}>
              Cancel
            </Button>
            <Button
              className="bg-olive-primary hover:bg-olive-primary/90"
              onClick={handleAddPackage}
            >
              Create Package
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog> */}
    </div>
  );
};

export default ServicePackagesPage;
