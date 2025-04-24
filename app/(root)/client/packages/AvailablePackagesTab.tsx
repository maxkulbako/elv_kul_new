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
import { useActionState, useEffect } from "react";
import { toast } from "sonner";
const AvailablePackagesTab = ({
  packages,
}: {
  packages: AvailablePackageTemplate[];
}) => {
  const [state, action, isPending] = useActionState(purchasePackegeAction, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (!state) return;

    if (state.success) {
      toast.success(state.message || "Package added to orders!", {
        richColors: true,
      });
    } else if (state.message) {
      toast.error(state.message || "Failed to add package to orders.", {
        richColors: true,
      });
    }
  }, [state]);

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
                <form action={action}>
                  <input
                    type="hidden"
                    name="packageTemplateId"
                    value={pkg.id}
                  />
                  <Button
                    className="bg-olive-primary hover:bg-olive-primary/90"
                    type="submit"
                    disabled={isPending}
                  >
                    {isPending ? "Processing..." : "Purchase Package"}
                  </Button>
                </form>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default AvailablePackagesTab;
