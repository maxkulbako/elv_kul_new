"use client";

import { useState } from "react";
import ScheduleAppointmentDialog from "./ScheduleAppointmentDialog";

const ScheduleDialogClientWrapper = ({
  children,
  isRescheduling = false,
  appointmentId,
  onSuccess,
  isAdmin = false,
}: {
  children: React.ReactNode;
  isRescheduling?: boolean;
  appointmentId?: string;
  onSuccess?: () => void;
  isAdmin?: boolean;
}) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      <ScheduleAppointmentDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        isRescheduling={isRescheduling}
        appointmentId={appointmentId}
        onSuccess={onSuccess}
        isAdmin={isAdmin}
      />
    </>
  );
};

export default ScheduleDialogClientWrapper;
