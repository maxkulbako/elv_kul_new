import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getClientAppointments } from "@/lib/actions/appointment.action";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CalendarPlus, ChevronRight } from "lucide-react";
import ScheduleAppointmentClientWrapper from "@/components/shared/ScheduleAppointmentClientWrapper";

type UpcomingAppointment = Awaited<
  ReturnType<typeof getClientAppointments>
>[number];

const appointmentStatusActions = (appointment: UpcomingAppointment) => {
  const { status, orderId } = appointment;
  let href = null;
  let buttonText = null;

  switch (status) {
    case "PAID":
      href = `/videocall/${appointment.id}`;
      buttonText = "Join Session";
      break;
    case "PAID_FROM_PACKAGE":
      href = `/videocall/${appointment.id}`;
      buttonText = "Join Session";
      break;
    case "PENDING_PAYMENT":
      href = `/client/orders/${orderId}`;
      buttonText = "View Order";
      break;
    case "PAYMENT_FAILED":
      href = `/client/orders/${orderId}`;
      buttonText = "View Orders";
      break;
    default:
      href = "/client/packages";
      buttonText = "View Orders";
  }
  return (
    <Link href={href}>
      <Button size="sm" className="bg-olive-primary hover:bg-olive-primary/90">
        {buttonText}
      </Button>
    </Link>
  );
};

export const UpcomingAppointments = async () => {
  const upcomingAppointments = await getClientAppointments();

  return (
    <Card className="bg-white">
      <CardHeader>
        <CardTitle>Upcoming Appointments</CardTitle>
        <CardDescription>Your scheduled therapy sessions</CardDescription>
      </CardHeader>
      <CardContent>
        {upcomingAppointments.length > 0 ? (
          <div className="space-y-4">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-olive-light rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-16 h-16 bg-olive-primary text-white rounded-lg flex flex-col items-center justify-center mr-4">
                    <span className="text-sm font-medium">
                      {new Intl.DateTimeFormat("en-US", {
                        month: "short",
                      }).format(appointment.date)}
                    </span>
                    <span className="text-2xl font-bold">
                      {appointment.date.getDate()}
                    </span>
                  </div>
                  <div>
                    {/* TODO: implement type in prisma schema */}
                    {/* <h4 className="font-medium">{appointment.type}</h4> */}
                    <h4 className="font-medium">Individual Therapy</h4>
                    <p className="text-sm text-muted-foreground">
                      {format(appointment.date, "h:mm a")} •{" "}
                      {appointment.durationMin || 50} minutes
                    </p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-olive-primary text-olive-primary hover:bg-olive-primary hover:text-white"
                  >
                    Reschedule
                  </Button>
                  {appointmentStatusActions(appointment)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              You have no upcoming appointments
            </p>
            <Button className="bg-olive-primary hover:bg-olive-primary/90">
              <CalendarPlus className="mr-2 h-4 w-4" />
              <ScheduleAppointmentClientWrapper>
                Schedule Now
              </ScheduleAppointmentClientWrapper>
            </Button>
          </div>
        )}

        <div className="mt-4 text-right">
          <Link
            href="/appointments"
            className="text-olive-primary hover:underline inline-flex items-center"
          >
            View all appointments
            <ChevronRight className="ml-1 h-4 w-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
