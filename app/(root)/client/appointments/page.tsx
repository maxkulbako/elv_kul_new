import { requireClientAuth } from "@/lib/auth/require-client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ScheduleAppointmentClientWrapper from "@/components/shared/ScheduleAppointmentClientWrapper";
import { Suspense } from "react";
import { UpcomingAppointmentsSkeleton } from "../dashboard/DashboardSkeletonCard";
import { UpcomingAppointmentsSection } from "./UpcommingAppointmentSection";
import { PastAppointmentsSection } from "./PastAppointmentsSection";
import { CalendarAppointmentsSection } from "./CalendarAppointmentsSection";

const AppointmentsPage = async () => {
  await requireClientAuth();

  return (
    <div className="container py-8 mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold">Appointments</h1>
        <ScheduleAppointmentClientWrapper>
          <Button className="bg-olive-primary hover:bg-olive-primary/90">
            Schedule New Appointment
          </Button>
        </ScheduleAppointmentClientWrapper>
      </div>

      <Tabs defaultValue="upcoming" className="mb-8">
        <TabsList className="mb-4">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming">
          <Suspense fallback={<UpcomingAppointmentsSkeleton />}>
            <UpcomingAppointmentsSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="past">
          <Suspense fallback={<UpcomingAppointmentsSkeleton />}>
            <PastAppointmentsSection />
          </Suspense>
        </TabsContent>

        <TabsContent value="calendar">
          <Suspense fallback={<UpcomingAppointmentsSkeleton />}>
            <CalendarAppointmentsSection />
          </Suspense>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AppointmentsPage;
