import AppointmentDetails from "@/components/admins/AppointmentDetails";

export default async function DetailsPage({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) {
  const { appointmentId } = await params;
  return <AppointmentDetails appointmentId={appointmentId} />;
}
