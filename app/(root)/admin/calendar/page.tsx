import { Suspense } from "react";
import CalendarView from "./CalendarView";
import { getAdminAppointmentsDates } from "@/lib/actions/admin.action";
import { CalendarViewSkeleton } from "./CalendarViewSkeleton";

export default async function CalendarPage() {
  const today = new Date();
  const initialDates = await getAdminAppointmentsDates(
    today.getFullYear(),
    today.getMonth()
  );

  return (
    <Suspense fallback={<CalendarViewSkeleton />}>
      <CalendarView initialDates={initialDates} />
    </Suspense>
  );
}
