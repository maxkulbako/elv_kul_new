import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { requireClientAuth } from "@/lib/auth/require-client";
import {
  CalendarPlus,
  Calendar,
  Clock,
  CreditCard,
  Video,
  Link,
  ChevronRight,
} from "lucide-react";

// Mock upcoming appointments data
const upcomingAppointments = [
  {
    id: "1",
    date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
    time: "10:00 AM",
    duration: 50,
    type: "Individual Therapy",
    status: "confirmed",
  },
  {
    id: "2",
    date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
    time: "2:30 PM",
    duration: 50,
    type: "Individual Therapy",
    status: "confirmed",
  },
];

// Format date to display day of week and date
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(date);
};

const ClientDashboardPage = async () => {
  await requireClientAuth();
  const session = await auth();
  const user = session?.user;

  return (
    <div className="flex-grow container py-8 mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">
            Welcome back, {user?.name}
          </h1>
          <p className="text-muted-foreground">
            Here's an overview of your therapy journey
          </p>
        </div>
        <Button className="mt-4 sm:mt-0 bg-olive-primary hover:bg-olive-primary/90">
          <CalendarPlus className="mr-2 h-4 w-4" />
          Book New Appointment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">
                  Next Appointment
                </p>
                <p className="text-2xl font-semibold">
                  {upcomingAppointments.length > 0
                    ? formatDate(upcomingAppointments[0].date)
                    : "None scheduled"}
                </p>
                {upcomingAppointments.length > 0 && (
                  <p className="text-olive-primary">
                    {upcomingAppointments[0].time}
                  </p>
                )}
              </div>
              <Calendar className="h-10 w-10 text-olive-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-semibold">12</p>
                <p className="text-olive-primary">View history</p>
              </div>
              <Clock className="h-10 w-10 text-olive-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Payment Due</p>
                <p className="text-2xl font-semibold">$0.00</p>
                <p className="text-olive-primary">All paid</p>
              </div>
              <CreditCard className="h-10 w-10 text-olive-primary" />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Session Package</p>
                <p className="text-2xl font-semibold">Standard</p>
                <p className="text-olive-primary">Upgrade plan</p>
              </div>
              <Video className="h-10 w-10 text-olive-primary" />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
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
                          <h4 className="font-medium">{appointment.type}</h4>
                          <p className="text-sm text-muted-foreground">
                            {appointment.time} • {appointment.duration} minutes
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
                        <Button
                          size="sm"
                          className="bg-olive-primary hover:bg-olive-primary/90"
                        >
                          Join Session
                        </Button>
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
                    Schedule Now
                  </Button>
                </div>
              )}

              <div className="mt-4 text-right">
                <Link
                  to="/appointments"
                  className="text-olive-primary hover:underline inline-flex items-center"
                >
                  View all appointments
                  <ChevronRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your therapy experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Button className="w-full justify-start" variant="outline">
                  <CalendarPlus className="mr-2 h-4 w-4" />
                  Book New Appointment
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <Video className="mr-2 h-4 w-4" />
                  Test Video Connection
                </Button>
                <Button className="w-full justify-start" variant="outline">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Manage Payment Methods
                </Button>
                <Button className="w-full justify-start bg-olive-primary hover:bg-olive-primary/90">
                  <Calendar className="mr-2 h-4 w-4" />
                  View Full Calendar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboardPage;
