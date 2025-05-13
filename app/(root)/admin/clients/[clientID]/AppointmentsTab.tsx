import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import ScheduleAppointmentClientWrapper from "@/components/shared/ScheduleAppointmentClientWrapper";

import { type Client } from "./page";

const AppointmentsTab = ({ client }: { client: Client }) => {
  console.log(client);
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle>Appointment History</CardTitle>
          <ScheduleAppointmentClientWrapper>
            <Button className="bg-olive-primary hover:bg-olive-primary/90">
              Schedule New
            </Button>
          </ScheduleAppointmentClientWrapper>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {client?.appointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 border rounded-md"
            >
              <div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2 text-olive-primary" />
                  <span className="font-medium">
                    {format(appointment.date, "MMM d, yyyy")}
                  </span>
                </div>
                <div className="text-sm text-muted-foreground mt-1">
                  &quot;Individual Therapy&quot; • {appointment.durationMin}{" "}
                  {/* TODO: add appointment type */}
                  minutes
                </div>
                {/* {appointment.notes && (
              <div className="text-sm mt-2 italic">
                {appointment.notes}
              </div>
            )} */}
              </div>
              <div
                className={`px-3 py-1 rounded-full text-xs font-medium ${
                  appointment.status === "COMPLETED"
                    ? "bg-green-100 text-green-800"
                    : appointment.status === "SCHEDULED"
                      ? "bg-blue-100 text-blue-800"
                      : appointment.status === "CANCELLED"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                }`}
              >
                {appointment.status.charAt(0).toUpperCase() +
                  appointment.status.slice(1)}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTab;
