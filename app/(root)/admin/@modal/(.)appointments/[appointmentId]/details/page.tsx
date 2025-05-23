import SlideOver from "@/components/admins/SlideOver";
import AppointmentDetails from "@/components/admins/AppointmentDetails";
import { Suspense } from "react";
import AppointmentDetailsSkeleton from "@/components/admins/AppointmentDetailsSkeleton";

const DetailsPage = async ({
  params,
}: {
  params: Promise<{ appointmentId: string }>;
}) => {
  const { appointmentId } = await params;

  if (!appointmentId) {
    return <SlideOver>No appointment ID</SlideOver>;
  }

  return (
    <SlideOver>
      <Suspense fallback={<AppointmentDetailsSkeleton />}>
        <AppointmentDetails appointmentId={appointmentId} />
      </Suspense>
    </SlideOver>
  );
};

export default DetailsPage;
