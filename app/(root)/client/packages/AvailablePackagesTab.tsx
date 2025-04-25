"use client";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  AvailablePackageTemplate,
  purchasePackegeAction,
} from "@/lib/actions/price.action";
import { useState, useTransition } from "react";
import { toast } from "sonner";

const AvailablePackagesTab = ({
  packages,
}: {
  packages: AvailablePackageTemplate[];
}) => {
  const [_isPurchasePending, startPurchaseTransition] = useTransition();
  const [pendingPurchaseId, setPendingPurchaseId] = useState<string | null>(
    null
  );

  const handlePurchasePackage = (packageId: string) => {
    setPendingPurchaseId(packageId);

    startPurchaseTransition(async () => {
      try {
        const result = await purchasePackegeAction(packageId);
        if (result.success) {
          toast.success(result.message || "Package added to orders!", {
            richColors: true,
          });
        } else {
          toast.error(result.message || "Failed to add package to orders.", {
            richColors: true,
          });
        }
      } catch (error) {
        console.error("Purchase transition error:", error);
        toast.error("An unexpected error occurred during purchase.", {
          richColors: true,
        });
      } finally {
        setPendingPurchaseId(null);
      }
    });
  };

  if (!packages || packages.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          No packages available for purchase right now.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {packages.map((pkg) => (
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
                    {pkg.sessionsTotal} sessions included
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Valid for {pkg.validDays} days
                  </p>
                </div>

                <Button
                  className="bg-olive-primary hover:bg-olive-primary/90"
                  onClick={() => handlePurchasePackage(pkg.id)}
                  disabled={pendingPurchaseId === pkg.id}
                >
                  {pendingPurchaseId === pkg.id
                    ? "Processing..."
                    : "Purchase Package"}
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
