import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";
import { format } from "date-fns";
import ScheduleAppointmentClientWrapper from "@/components/shared/ScheduleAppointmentClientWrapper";
import AppointmentStatusForm from "./AppointmentStatusForm";
import { type Client } from "./page";

const AppointmentsTab = ({ client }: { client: Client }) => {
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
              <AppointmentStatusForm
                initialStatus={appointment.status}
                appointmentId={appointment.id}
              />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTab;
