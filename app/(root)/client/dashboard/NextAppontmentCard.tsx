import { Calendar } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { getNextAppointment } from "@/lib/actions/appointment.action";

export const NextAppointmentCard = async () => {
  const nextAppointment = await getNextAppointment();

  const formattedDate = nextAppointment
    ? new Intl.DateTimeFormat("en-US", {
        weekday: "short",
        month: "short",
        day: "numeric",
      }).format(new Date(nextAppointment.date))
    : "None scheduled";

  return (
    <Card className="bg-white">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">Next Appointment</p>
            <p className="text-2xl font-semibold">{formattedDate}</p>
            {nextAppointment && (
              <p className="text-olive-primary">
                {nextAppointment.durationMin || 50} minutes
              </p>
            )}
          </div>
          <Calendar className="h-10 w-10 text-olive-primary" />
        </div>
      </CardContent>
    </Card>
  );
};
