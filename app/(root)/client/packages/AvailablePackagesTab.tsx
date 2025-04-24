import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const availablePackages = [
  {
    id: 1,
    name: "Basic Package",
    sessions: 4,
    price: 199,
    description: "4 therapy sessions per month",
  },
  {
    id: 2,
    name: "Premium Package",
    sessions: 8,
    price: 379,
    description: "8 therapy sessions per month",
  },
];

const AvailablePackagesTab = () => {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {availablePackages.map((pkg) => (
        <Card key={pkg.id}>
          <CardHeader>
            <CardTitle>{pkg.name}</CardTitle>
            <CardDescription>{pkg.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-2xl font-bold">${pkg.price}</p>
                  <p className="text-sm text-muted-foreground">
                    {pkg.sessions} sessions included
                  </p>
                </div>
                <Button className="bg-olive-primary hover:bg-olive-primary/90">
                  Purchase Package
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AvailablePackagesTab;
