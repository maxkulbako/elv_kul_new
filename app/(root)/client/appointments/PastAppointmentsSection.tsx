import { getPastAppointments } from "@/lib/actions/appointment.action";
import { AppointmentsCard } from "./AppointmentsCard";

export const PastAppointmentsSection = async () => {
  const appointments = await getPastAppointments();

  if (appointments.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg">
        <p className="text-muted-foreground">No past appointments found</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <AppointmentsCard
          key={appointment.id}
          appointment={appointment}
          isPast
        />
      ))}
    </div>
  );
};
