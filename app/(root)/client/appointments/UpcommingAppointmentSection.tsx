import { getClientAppointments } from "@/lib/actions/appointment.action";
import { AppointmentsCard } from "./AppointmentsCard";
import ScheduleAppointmentClientWrapper from "@/components/shared/ScheduleAppointmentClientWrapper";
import { Button } from "@/components/ui/button";

export const UpcomingAppointmentsSection = async () => {
  const appointments = await getClientAppointments();
  const upcoming = appointments.filter((a) => a.status === "SCHEDULED");

  if (upcoming.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-muted-foreground mb-4">
          You have no upcoming appointments
        </p>
        <ScheduleAppointmentClientWrapper>
          <Button className="bg-olive-primary hover:bg-olive-primary/90">
            Schedule New Appointment
          </Button>
        </ScheduleAppointmentClientWrapper>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {upcoming.map((appointment) => (
        <AppointmentsCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
};
