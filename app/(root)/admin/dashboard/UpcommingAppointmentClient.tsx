"use client";

import { AppointmentCardDTO } from "@/types/appointments";
import UpcomingAppointmentCard from "./UpcomingAppointmentCard";
import { useRouter } from "next/navigation";

const UpcommingAppointmentClient = ({
  appointments,
}: {
  appointments: AppointmentCardDTO[];
}) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
      {appointments.map((appointment) => (
        <div key={appointment.id}>
          <UpcomingAppointmentCard
            appointment={appointment}
            onOpenDetails={(id) =>
              router.push(`/admin/appointments/${id}/details`)
            }
          />
        </div>
      ))}
    </div>
  );
};

export default UpcommingAppointmentClient;
