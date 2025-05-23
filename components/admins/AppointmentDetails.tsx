import { format } from "date-fns";
import AppointmentActionBar from "@/components/admins/AppointmentActionBar";
import { Badge } from "@/components/ui/badge";
import { getAppointmentDTO } from "@/lib/actions/admin.action";
import {
  Clock,
  Calendar,
  Video,
  Building,
  User,
  DollarSign,
  Package,
} from "lucide-react";

interface Props {
  appointmentId: string;
}

const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "PAID":
    case "PAID_FROM_PACKAGE":
      return "bg-green-100 text-green-800 border-green-200";
    case "PENDING_PAYMENT":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "CANCELLED":
      return "bg-red-100 text-red-800 border-red-200";
    case "COMPLETED":
    case "COMPLETED_AND_REFUNDED":
      return "bg-blue-100 text-blue-800 border-blue-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const formatCurrency = (amount?: number, currency?: string) => {
  if (!amount) return "-";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "USD",
  }).format(amount);
};

export default async function AppointmentDetails({ appointmentId }: Props) {
  const appointment = await getAppointmentDTO(appointmentId);
  if (!appointment) return null;

  return (
    <div className="p-6">
      <div className="mb-6">
        <div className="text-xl">Appointment Details</div>
        <div>{format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}</div>
        <div className="mt-2">
          <Badge
            className={`${getStatusBadgeColor(appointment.status)} font-medium`}
          >
            {appointment.status.replace("_", " ")}
          </Badge>
        </div>
      </div>

      <div className="space-y-6 p-6">
        {/* Time & Type */}
        <div className="space-y-3">
          <div className="text-md font-medium text-gray-500">
            Session Details
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-500" />
            <div>
              <span className="font-medium">
                {format(new Date(appointment.date), "h:mm a")}
              </span>
              <span className="text-gray-500">
                {" "}
                • {appointment.durationMin} minutes
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-500" />
            <div>
              {format(new Date(appointment.date), "EEEE, MMMM d, yyyy")}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Video className="h-4 w-4 text-gray-500" />
            <div>{appointment.order?.type}</div>
          </div>
          <div className="flex items-center gap-2">
            <Building className="h-4 w-4 text-gray-500" />
            <div>appointment.location</div>
          </div>
        </div>

        {/* Client Information */}
        <div className="pt-2 border-t space-y-3">
          <div className="text-md font-medium text-gray-500">Client</div>
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-gray-500" />
            <div>
              <div className="font-medium">{appointment.client.name}</div>
              <div className="text-gray-500">example@example.com</div>
            </div>
          </div>
        </div>

        {/* Payment Information */}
        <div className="pt-2 border-t space-y-3">
          <div className="text-md font-medium text-gray-500">Payment</div>

          {appointment.order ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <div>
                  <div>Order #{appointment.order.id}</div>
                  <div>
                    Type:{" "}
                    <span className="font-medium">
                      {appointment.order.type}
                    </span>
                  </div>
                  <div>
                    Status:{" "}
                    <span className="font-medium">
                      {appointment.order.status}
                    </span>
                  </div>
                  <div>Amount: {formatCurrency(100, "UAH")}</div>
                </div>
              </div>
            </div>
          ) : appointment.packagePurchase ? (
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-gray-500" />
                <div>
                  <div>Package #{appointment.packagePurchase.id}</div>
                  {appointment.packagePurchase.id && (
                    <div>
                      Name:{" "}
                      <span className="font-medium">
                        {appointment.packagePurchase.id}
                      </span>
                    </div>
                  )}
                  <div>
                    Sessions used: {appointment.packagePurchase.sessionsUsed} of{" "}
                    {appointment.packagePurchase.sessionsTotal}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-gray-500">
              No payment information available
            </div>
          )}
        </div>

        {/* Notes */}
        {appointment && (
          <div className="pt-2 border-t space-y-3">
            <div className="text-md font-medium text-gray-500">Notes</div>
            <div className="text-sm">
              {["asdasd", "asdasdad"].map((note) => (
                <div key={note}>{note}</div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 border-t pt-4">
        <div className="w-full flex flex-col gap-4">
          <p className="text-md font-medium text-gray-500">Actions</p>
          <div className="flex flex-wrap justify-start gap-2">
            <AppointmentActionBar appointment={appointment} view="details" />
          </div>
        </div>
      </div>
    </div>
  );
}
