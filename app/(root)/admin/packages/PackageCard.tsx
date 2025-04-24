import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { calculateSavings } from "@/lib/utils";
import { Package, Calendar, Edit, Trash } from "lucide-react";
import { Decimal } from "@prisma/client/runtime/library";
import PackageDisactiveDialog from "./PackageDisactiveDialog";

export interface IPackageCard {
  id: string;
  name: string;
  createdAt: Date;
  price: Decimal;
  updatedAt: Date;
  description: string | null;
  sessionsTotal: number;
  validDays: number;
  isActive: boolean;
}

const PackageCard = ({
  packageData,
  regularPrice,
}: {
  packageData: IPackageCard;
  regularPrice: Decimal | undefined;
}) => {
  return (
    <Card
      key={packageData.id}
      className={packageData.isActive === false ? "opacity-70" : ""}
    >
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle>{packageData.name}</CardTitle>
            <CardDescription className="mt-1">
              {packageData.description}
            </CardDescription>
          </div>
          <div
            className={`px-2 py-1 text-xs rounded-full ${
              packageData.isActive === true
                ? "bg-green-100 text-green-800"
                : "bg-gray-100 text-gray-800"
            }`}
          >
            {packageData.isActive ? "Active" : "Inactive"}
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 space-y-4">
        <div className="flex justify-between text-lg font-semibold">
          <div>${Number(packageData.price)}</div>
          <div className="text-sm text-olive-primary flex items-center">
            <Package className="h-4 w-4 mr-1" />
            {packageData.sessionsTotal} sessions
          </div>
        </div>

        <div className="text-sm">
          <div className="flex justify-between mb-2">
            <span>Regular price:</span>
            <span>
              ${Number(regularPrice)} × {packageData.sessionsTotal} = $
              {Number(regularPrice) * packageData.sessionsTotal}
            </span>
          </div>
          <div className="flex justify-between font-medium text-olive-primary">
            <span>Savings:</span>
            <span>
              $
              {
                calculateSavings(
                  Number(regularPrice),
                  packageData.sessionsTotal,
                  Number(packageData.price)
                ).amount
              }
              (
              {
                calculateSavings(
                  Number(regularPrice),
                  packageData.sessionsTotal,
                  Number(packageData.price)
                ).percentage
              }
              %)
            </span>
          </div>
        </div>

        <div className="text-sm">
          <div className="flex items-center">
            <Calendar className="h-4 w-4 mr-2 text-muted-foreground" />
            Valid for {packageData.validDays} days
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm">
          <Edit className="h-4 w-4 mr-1" />
          Edit
        </Button>
        <PackageDisactiveDialog
          id={packageData.id}
          isActive={packageData.isActive}
        />
      </CardFooter>
    </Card>
  );
};

export default PackageCard;
