import { format } from "date-fns";
import AppointmentActionBar from "@/components/admins/AppointmentActionBar";
import { AppointmentCardDTO } from "@/types/appointments";

const UpcomingUppointmentCard = ({
  appointment,
  onOpenDetails,
}: {
  appointment: AppointmentCardDTO;
  onOpenDetails: (id: string) => void;
}) => {
  return (
    <div className="flex items-center justify-between p-4 bg-olive-light rounded-lg">
      <div className="flex items-center">
        <div className="w-12 h-12 bg-olive-primary text-white rounded-full flex items-center justify-center mr-4">
          {appointment.client.name?.charAt(0).toUpperCase()}
        </div>
        <div>
          <h4 className="font-medium">{appointment.client.name}</h4>
          <p className="text-sm text-muted-foreground">
            {format(appointment.date, "MMM d")} • {appointment.durationMin}{" "}
            minutes
          </p>
        </div>
      </div>
      <AppointmentActionBar
        appointment={{
          id: appointment.id,
          date: appointment.date,
          status: appointment.status,
          repayUrl: appointment.repayUrl,
          order: appointment.order,
          packagePurchase: appointment.packagePurchase,
        }}
        view="dashboard"
        onOpenDetails={onOpenDetails}
      />
      {/* <div className="flex space-x-2">
      <Link href={`/admin/clients/${appointment.clientId}`}>
        <User className="h-5 w-5 text-olive-primary mr-2 cursor-pointer" />
      </Link>
      <Link href={`/videocall/${appointment.id}`}>
        <Video className="h-5 w-5 text-olive-primary cursor-pointer" />
      </Link>
    </div> */}
    </div>
  );
};

export default UpcomingUppointmentCard;
