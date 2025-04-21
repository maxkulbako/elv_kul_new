import CalendarView from "./CalendarView";
import { getAdminAppointmentsDates } from "@/lib/actions/admin.action";

export default async function CalendarPage() {
  const today = new Date();
  const initialDates = await getAdminAppointmentsDates(
    today.getFullYear(),
    today.getMonth()
  );

  return <CalendarView initialDates={initialDates} />;
}
