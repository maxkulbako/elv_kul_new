"use client";

import { useState } from "react";
import ScheduleAppointmentDialog from "./ScheduleAppointmentDialog";

const ScheduleDialogClientWrapper = ({
  children,
  isRescheduling = false,
  existingDate,
  appointmentId,
  onSuccess,
}: {
  children: React.ReactNode;
  isRescheduling?: boolean;
  existingDate?: Date;
  appointmentId?: string;
  onSuccess?: () => void;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      <ScheduleAppointmentDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        isRescheduling={isRescheduling}
        existingDate={existingDate}
        appointmentId={appointmentId}
        onSuccess={onSuccess}
      />
    </>
  );
};

export default ScheduleDialogClientWrapper;
