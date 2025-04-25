import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { Check, Clock, Video, X } from "lucide-react";

type Appointment = {
  id: string;
  date: string | Date;
  durationMin: number;
  status: string;
};

type Props = {
  appointment: Appointment;
  isPast?: boolean;
};

export const StatusBadge = ({ status }: { status: string }) => {
  const statusMap = {
    COMPLETED: {
      className: "bg-green-100 text-green-800 border-green-200",
      icon: <Check className="h-3 w-3 mr-1" />,
    },
    SCHEDULED: {
      className: "bg-blue-100 text-blue-800 border-blue-200",
      icon: <Clock className="h-3 w-3 mr-1" />,
    },
    CANCELED: {
      className: "bg-red-100 text-red-800 border-red-200",
      icon: <X className="h-3 w-3 mr-1" />,
    },
    MISSED: {
      className: "bg-orange-100 text-orange-800 border-orange-200",
      icon: <X className="h-3 w-3 mr-1" />,
    },
    DEFAULT: {
      className: "bg-gray-100 text-gray-800 border-gray-200",
      icon: null,
    },
  };

  const badge =
    statusMap[status as keyof typeof statusMap] || statusMap.DEFAULT;

  return (
    <span
      className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${badge.className}`}
    >
      {badge.icon}
      {status.charAt(0) + status.slice(1).toLowerCase()}
    </span>
  );
};

export const AppointmentsCard: React.FC<Props> = ({
  appointment,
  isPast = false,
}) => {
  const dateObj =
    typeof appointment.date === "string"
      ? new Date(appointment.date)
      : appointment.date;

  return (
    <Card className="bg-white hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div
              className={`w-16 h-16 rounded-lg flex flex-col items-center justify-center mr-4 ${
                isPast
                  ? "bg-gray-200 text-gray-700"
                  : "bg-olive-primary text-white"
              }`}
            >
              <span className="text-sm font-medium">
                {format(dateObj, "MMM")}
              </span>
              <span className="text-2xl font-bold">{format(dateObj, "d")}</span>
            </div>
            <div>
              <h4 className="font-medium">Individual Therapy</h4>
              <p className="text-sm text-muted-foreground">
                {format(dateObj, "h:mm a")} • {appointment.durationMin} minutes
              </p>
              <p className="text-sm text-muted-foreground">Dr. Sarah Johnson</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row items-end md:items-center gap-2">
            <StatusBadge status={appointment.status} />
            {!isPast && (
              <Button
                size="sm"
                className="bg-olive-primary hover:bg-olive-primary/90"
              >
                <Video className="mr-2 h-4 w-4" />
                Join
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
