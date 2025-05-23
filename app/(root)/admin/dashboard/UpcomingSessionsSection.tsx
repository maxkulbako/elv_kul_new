import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { getUpcommingAppointments } from "@/lib/actions/admin.action";
import UpcommingAppointmentClient from "./UpcommingAppointmentClient";

const UpcomingSessionsSection = async () => {
  const upcomingAppointments = await getUpcommingAppointments(5);

  return (
    <Card className="lg:col-span-2">
      <CardHeader>
        <CardTitle>Upcoming Sessions</CardTitle>
        <CardDescription>Your scheduled appointments for today</CardDescription>
      </CardHeader>
      <CardContent>
        <UpcommingAppointmentClient appointments={upcomingAppointments} />
      </CardContent>
    </Card>
  );
};

export default UpcomingSessionsSection;
