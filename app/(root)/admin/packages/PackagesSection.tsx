import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Plus, Package, Calendar, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import GlobalPriceSection from "./GlobalPriceSection";

// Mock service packages
const servicePackages = [
  {
    id: "1",
    name: "Starter Package",
    description:
      "Perfect for those starting their therapy journey. Includes 4 sessions at a discounted rate.",
    sessions: 4,
    regularPrice: 140,
    packagePrice: 500,
    validityPeriod: "2 months",
    status: "active",
  },
  {
    id: "2",
    name: "Standard Package",
    description:
      "Our most popular package. Includes 8 sessions for comprehensive therapy coverage.",
    sessions: 8,
    regularPrice: 140,
    packagePrice: 950,
    validityPeriod: "3 months",
    status: "active",
  },
  {
    id: "3",
    name: "Premium Package",
    description:
      "Ideal for those seeking ongoing therapy. Includes 12 sessions with priority scheduling.",
    sessions: 12,
    regularPrice: 140,
    packagePrice: 1350,
    validityPeriod: "6 months",
    status: "active",
  },
  {
    id: "4",
    name: "Seasonal Special",
    description:
      "Limited time offer for spring. Includes 6 sessions with a special discount.",
    sessions: 6,
    regularPrice: 140,
    packagePrice: 700,
    validityPeriod: "3 months",
    status: "inactive",
  },
];

const PackagesSection = () => {
  const calculateSavings = (
    regularPrice: number,
    sessions: number,
    packagePrice: number
  ) => {
    const regularTotal = regularPrice * sessions;
    const savings = regularTotal - packagePrice;
    const percentage = (savings / regularTotal) * 100;

    return {
      amount: savings,
      percentage: Math.round(percentage),
    };
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {servicePackages.map((pkg) => (
        <Card
          key={pkg.id}
          className={pkg.status === "inactive" ? "opacity-70" : ""}
        >
          <CardHeader>
            <div className="flex justify-between items-start">
              <div>
                <CardTitle>{pkg.name}</CardTitle>
                <CardDescription className="mt-1">
                  {pkg.description}
                </CardDescription>
              </div>
              <div
                className={`px-2 py-1 text-xs rounded-full ${
                  pkg.status === "active"
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {pkg.status.charAt(0).toUpperCase() + pkg.status.slice(1)}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <div>${pkg.packagePrice}</div>
              <div className="text-sm text-olive-primary flex items-center">
                <Package className="h-4 w-4 mr-1" />
                {pkg.sessions} sessions
              </div>
            </div>

            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span>Regular price:</span>
                <span>
                  ${pkg.regularPrice} × {pkg.sessions} = $
                  {pkg.regularPrice * pkg.sessions}
                </span>
              </div>
              <div className="flex justify-between font-medium text-olive-primary">
                <span>Savings:</span>
                <span>
                  $
                  {
                    calculateSavings(
                      pkg.regularPrice,
                      pkg.sessions,
                      pkg.packagePrice
                    ).amount
                  }
                  (
                  {
                    calculateSavings(
                      pkg.regularPrice,
                      pkg.sessions,
                      pkg.packagePrice
                    ).percentage
                  }
                  %)
                </span>
              </div>
            </div>

            <div className="text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                Valid for {pkg.validityPeriod}
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between">
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
            <Button variant="ghost" size="sm" className="text-red-600">
              <Trash className="h-4 w-4 mr-1" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};

export default PackagesSection;
