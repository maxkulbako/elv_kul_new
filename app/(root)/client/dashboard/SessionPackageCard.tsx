import { Card, CardContent } from "@/components/ui/card";
import { Video } from "lucide-react";
import { getCurrentSessionPackage } from "@/lib/actions/appointment.action";

export const SessionPackageCard = async () => {
  const sessionPackage = await getCurrentSessionPackage();

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Session Package</p>
            <p className="text-2xl font-semibold">
              {sessionPackage?.packageSize ?? "None"}
            </p>
            <p className="text-olive-primary">
              {sessionPackage?.packageSize ?? "No plan active"}
            </p>
          </div>
          <Video className="h-10 w-10 text-olive-primary" />
        </div>
      </CardContent>
    </Card>
  );
};
