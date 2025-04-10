"use client";

import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Clock, CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { scheduleAppointment } from "@/lib/actions/appointment.action";
import { useActionState } from "react";
import router from "next/router";

type ScheduleAppointmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isRescheduling?: boolean;
  existingDate?: Date;
};

const timeSlots = [
  "9:00 AM",
  "10:00 AM",
  "11:00 AM",
  "1:00 PM",
  "2:00 PM",
  "3:00 PM",
  "4:00 PM",
];

const ScheduleAppointmentDialog: React.FC<ScheduleAppointmentDialogProps> = ({
  isOpen,
  onClose,
  isRescheduling = false,
  existingDate,
}) => {
  const [date, setDate] = useState<Date | undefined>(existingDate || undefined);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(
    existingDate ? format(existingDate, "h:mm a") : ""
  );

  const [state, action, isPending] = useActionState(scheduleAppointment, {
    success: false,
    message: "",
  });

  const handleDateSelect = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
  };

  useEffect(() => {
    if (state.success) {
      onClose();
    }
  }, [state.success, isPending]);

  const handleSubmit = (formData: FormData) => {
    if (!date || !selectedTimeSlot) return;

    formData.set("date", date.toISOString());
    formData.set("time", selectedTimeSlot);

    action(formData);
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>
            {isRescheduling ? "Reschedule Appointment" : "Schedule Appointment"}
          </DialogTitle>
          <DialogDescription>
            {isRescheduling
              ? "Choose a new date and time for your appointment"
              : "Select your preferred date and time for the appointment"}
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="flex flex-col gap-4">
          <div className="grid gap-2">
            <label className="text-sm font-medium">Date</label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                  type="button"
                >
                  {date ? format(date, "PPP") : "Select a date"}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={handleDateSelect}
                  disabled={(date) => {
                    // Disable past dates and weekends (Saturday and Sunday)
                    const day = date.getDay();
                    return (
                      date < new Date(new Date().setHours(0, 0, 0, 0)) ||
                      day === 0 ||
                      day === 6
                    );
                  }}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-medium">Time Slot</label>
            <div className="grid grid-cols-3 gap-2">
              {timeSlots.map((time) => (
                <Button
                  key={time}
                  variant={selectedTimeSlot === time ? "default" : "outline"}
                  className={cn(
                    selectedTimeSlot === time
                      ? "bg-olive-primary text-white"
                      : "border-olive-primary text-olive-primary"
                  )}
                  onClick={() => setSelectedTimeSlot(time)}
                  type="button"
                >
                  <Clock className="mr-1 h-3 w-3" />
                  {time}
                </Button>
              ))}
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" type="button" onClick={onClose}>
              Cancel
            </Button>
            <Button
              className="bg-olive-primary hover:bg-olive-primary/90"
              type="submit"
              disabled={!date || !selectedTimeSlot || isPending}
            >
              {isPending
                ? "Scheduling..."
                : isRescheduling
                ? "Reschedule"
                : "Schedule"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ScheduleAppointmentDialog;
