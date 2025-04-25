import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Package } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockActivePackage = {
  id: 1,
  name: "Basic Package",
  sessionsTotal: 4,
  sessionsUsed: 1,
  sessionsRemaining: 3,
  validUntil: "2024-05-24",
};

const ActivePackageTab = () => {
  return (
    <>
      {mockActivePackage ? (
        <Card>
          <CardHeader>
            <CardTitle>Current Active Package</CardTitle>
            <CardDescription>
              Your ongoing therapy package details
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid gap-2">
                <h3 className="text-lg font-semibold">
                  {mockActivePackage.name}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-olive-light rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">
                      Total Sessions
                    </p>
                    <p className="text-2xl font-semibold">
                      {mockActivePackage.sessionsTotal}
                    </p>
                  </div>
                  <div className="p-4 bg-olive-light rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Used</p>
                    <p className="text-2xl font-semibold">
                      {mockActivePackage.sessionsUsed}
                    </p>
                  </div>
                  <div className="p-4 bg-olive-light rounded-lg text-center">
                    <p className="text-sm text-muted-foreground">Remaining</p>
                    <p className="text-2xl font-semibold">
                      {mockActivePackage.sessionsRemaining}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  Valid until:{" "}
                  {new Date(mockActivePackage.validUntil).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <Package className="h-12 w-12 mx-auto text-olive-primary" />
              <p>You don&apos;t have any active package.</p>
              <Button className="bg-olive-primary hover:bg-olive-primary/90">
                Browse Available Packages
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </>
  );
};

export default ActivePackageTab;
