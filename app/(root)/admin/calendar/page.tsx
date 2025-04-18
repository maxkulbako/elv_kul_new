import { getAdminAppointmentsDates } from "@/lib/actions/admin.acrion";
import CalendarView from "./CalendarView";

export default async function AdminCalendarPage() {
  const today = new Date();
  const dates = await getAdminAppointmentsDates(
    today.getFullYear(),
    today.getMonth()
  );

  return <CalendarView initialDates={dates} />;
}
