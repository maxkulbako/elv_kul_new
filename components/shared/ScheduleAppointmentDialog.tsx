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
import {
  getAvailableSlots,
  scheduleAppointment,
} from "@/lib/actions/appointment.action";
import { useActionState } from "react";
import { toast } from "sonner";

type ScheduleAppointmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isRescheduling?: boolean;
  appointmentId?: string;
  onSuccess?: () => void;
};

type TimeSlot = {
  timeSlotId: string;
  time: string;
};

const ScheduleAppointmentDialog: React.FC<ScheduleAppointmentDialogProps> = ({
  isOpen,
  onClose,
  isRescheduling = false,
  appointmentId,
  onSuccess,
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    TimeSlot | undefined
  >(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const [state, action, isPending] = useActionState(scheduleAppointment, {
    success: false,
    message: "",
  });

  const handleDateSelect = async (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    setIsPopoverOpen(false);
    if (selectedDate) {
      const availableSlots = await getAvailableSlots(selectedDate);
      setTimeSlots(availableSlots);
    }
  };

  useEffect(() => {
    if (state.success) {
      toast.success(state.message, {
        richColors: true,
      });
      onClose();
      onSuccess?.();
      setDate(undefined);
      setSelectedTimeSlot(undefined);
      setTimeSlots([]);
    } else if (state.message) {
      toast.error(state.message, {
        richColors: true,
      });
    }
  }, [state, onSuccess, onClose]);

  const handleSubmit = async (formData: FormData) => {
    if (!date || !selectedTimeSlot) {
      toast.error("Please select both date and time");
      return;
    }

    if (appointmentId) {
      formData.set("appointmentId", appointmentId);
    }

    formData.set("date", date.toISOString());
    formData.set("timeSlotId", selectedTimeSlot?.timeSlotId || "");

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
            <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full pl-3 text-left font-normal",
                    !date && "text-muted-foreground",
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
            {timeSlots.length > 0 ? (
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((time) => (
                  <Button
                    key={time.timeSlotId}
                    variant={
                      selectedTimeSlot?.timeSlotId === time.timeSlotId
                        ? "default"
                        : "outline"
                    }
                    className={cn(
                      selectedTimeSlot?.timeSlotId === time.timeSlotId
                        ? "bg-olive-primary text-white"
                        : "border-olive-primary text-olive-primary",
                    )}
                    onClick={() => setSelectedTimeSlot(time)}
                    type="button"
                  >
                    <Clock className="mr-1 h-3 w-3" />
                    {time.time}
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                No available slots for this date
              </p>
            )}
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
