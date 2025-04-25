import { Card, CardContent } from "@/components/ui/card";
import { getTotalSessions } from "@/lib/actions/appointment.action";
import { Clock } from "lucide-react";

export const TotalSessionsCard = async () => {
  const total = await getTotalSessions();

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Total Sessions</p>
            <p className="text-2xl font-semibold">{total}</p>
            <p className="text-olive-primary">View history</p>
          </div>
          <Clock className="h-10 w-10 text-olive-primary" />
        </div>
      </CardContent>
    </Card>
  );
};
