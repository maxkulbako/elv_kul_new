import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CalendarPlus, Calendar, CreditCard, Video } from "lucide-react";
import ScheduleAppointmentClientWrapper from "@/components/shared/ScheduleAppointmentClientWrapper";
import { NextAppointmentCard } from "@/app/(root)/client/dashboard/NextAppontmentCard";
import { TotalSessionsCard } from "@/app/(root)/client/dashboard/TotalSessionCard";
import { PaymentDueCard } from "@/app/(root)/client/dashboard/PaymentDueCard";
import { SessionPackageCard } from "@/app/(root)/client/dashboard/SessionPackageCard";
import {
  DashboardSkeletonCard,
  UpcomingAppointmentsSkeleton,
} from "@/app/(root)/client/dashboard/DashboardSkeletonCard";
import { Suspense } from "react";
import { UpcomingAppointments } from "@/app/(root)/client/dashboard/UpcomingAppointments";

const ClientDashboardPage = async () => {
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

        <ScheduleAppointmentClientWrapper>
          <Button className="mt-4 sm:mt-0 bg-olive-primary hover:bg-olive-primary/90">
            <CalendarPlus className="mr-2 h-4 w-4" />
            Book New Appointment
          </Button>
        </ScheduleAppointmentClientWrapper>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Suspense fallback={<DashboardSkeletonCard />}>
          <NextAppointmentCard />
        </Suspense>
        <Suspense fallback={<DashboardSkeletonCard />}>
          <TotalSessionsCard />
        </Suspense>

        <Suspense fallback={<DashboardSkeletonCard />}>
          <PaymentDueCard />
        </Suspense>

        <Suspense fallback={<DashboardSkeletonCard />}>
          <SessionPackageCard />
        </Suspense>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Suspense fallback={<UpcomingAppointmentsSkeleton />}>
            <UpcomingAppointments />
          </Suspense>
        </div>

        <div>
          <Card className="bg-white">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Manage your therapy experience</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <ScheduleAppointmentClientWrapper>
                  <Button className="w-full justify-start" variant="outline">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Book New Appointment
                  </Button>
                </ScheduleAppointmentClientWrapper>

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
