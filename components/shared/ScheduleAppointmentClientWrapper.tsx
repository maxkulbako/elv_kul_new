"use client";

import { useState } from "react";
import ScheduleAppointmentDialog from "./ScheduleAppointmentDialog";

const ScheduleDialogClientWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [open, setOpen] = useState(false);

  const handleSchedule = (date: Date, timeSlot: string) => {
    // Send to API or console.log for now
    console.log("Scheduled appointment on", date, timeSlot);
  };

  return (
    <>
      <div onClick={() => setOpen(true)}>{children}</div>

      <ScheduleAppointmentDialog
        isOpen={open}
        onClose={() => setOpen(false)}
        onSchedule={handleSchedule}
      />
    </>
  );
};

export default ScheduleDialogClientWrapper;
