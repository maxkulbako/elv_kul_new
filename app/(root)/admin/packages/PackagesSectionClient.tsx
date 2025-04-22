import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Package, Calendar, Edit, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Decimal } from "@prisma/client/runtime/library";
import { calculateSavings } from "@/lib/utils";

interface PackageTemplateProps {
  initialData: {
    id: string;
    name: string;
    createdAt: Date;
    price: Decimal;
    updatedAt: Date;
    description: string | null;
    sessionsTotal: number;
    validDays: number;
    isActive: boolean;
  }[];
  regularPrice: Decimal | undefined;
}

const PackagesSection = ({
  initialData,
  regularPrice,
}: PackageTemplateProps) => {
  if (initialData.length === 0) {
    return <div>No packages found</div>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {initialData.map((pkg) => (
        <Card
          key={pkg.id}
          className={pkg.isActive === false ? "opacity-70" : ""}
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
                  pkg.isActive === true
                    ? "bg-green-100 text-green-800"
                    : "bg-gray-100 text-gray-800"
                }`}
              >
                {pkg.isActive ? "Active" : "Inactive"}
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-2 space-y-4">
            <div className="flex justify-between text-lg font-semibold">
              <div>${Number(pkg.price)}</div>
              <div className="text-sm text-olive-primary flex items-center">
                <Package className="h-4 w-4 mr-1" />
                {pkg.sessionsTotal} sessions
              </div>
            </div>

            <div className="text-sm">
              <div className="flex justify-between mb-2">
                <span>Regular price:</span>
                <span>
                  ${Number(regularPrice)} × {pkg.sessionsTotal} = $
                  {Number(regularPrice) * pkg.sessionsTotal}
                </span>
              </div>
              <div className="flex justify-between font-medium text-olive-primary">
                <span>Savings:</span>
                <span>
                  $
                  {
                    calculateSavings(
                      Number(regularPrice),
                      pkg.sessionsTotal,
                      Number(pkg.price)
                    ).amount
                  }
                  (
                  {
                    calculateSavings(
                      Number(regularPrice),
                      pkg.sessionsTotal,
                      Number(pkg.price)
                    ).percentage
                  }
                  %)
                </span>
              </div>
            </div>

            <div className="text-sm">
              <div className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
                Valid for {pkg.validDays} days
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
