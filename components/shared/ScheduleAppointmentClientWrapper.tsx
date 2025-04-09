"use client";

import { useState } from "react";
import ScheduleAppointmentDialog from "./ScheduleAppointmentDialog";

const ScheduleDialogClientWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);


  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      <ScheduleAppointmentDialog
        isOpen={open}
        onClose={() => setOpen(false)}
      />
    </>
  );
};

export default ScheduleDialogClientWrapper;
