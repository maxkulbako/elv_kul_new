import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getAdminAppointments } from "@/lib/actions/admin.acrion";
import { User, Video } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

const UpcomingSessionsSection = async () => {
  const upcomingAppointments = await getAdminAppointments(5);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Your scheduled appointments for today</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {upcomingAppointments.map((appointment) => (
            <div
              key={appointment.id}
              className="flex items-center justify-between p-4 bg-olive-light rounded-lg"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-olive-primary text-white rounded-full flex items-center justify-center mr-4">
                  {appointment.client.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h4 className="font-medium">{appointment.client.name}</h4>
                  <p className="text-sm text-muted-foreground">
                    {format(appointment.date, "MMM d")} •{" "}
                    {appointment.durationMin} minutes
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Link href={`/admin/clients/${appointment.clientId}`}>
                  <User className="h-5 w-5 text-olive-primary mr-2 cursor-pointer" />
                </Link>
                <Link href={`/admin/sessions/${appointment.id}`}>
                  <Video className="h-5 w-5 text-olive-primary cursor-pointer" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsSection;
