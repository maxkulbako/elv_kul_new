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
import { cn } from "@/lib/utils/utils";
import {
  getAvailableSlots,
  scheduleAppointment,
} from "@/lib/actions/appointment.action";
import { useActionState } from "react";
import { toast } from "sonner";
import { getAdminClients } from "@/lib/actions/admin.action";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "../ui/label";

type ScheduleAppointmentDialogProps = {
  isOpen: boolean;
  onClose: () => void;
  isRescheduling?: boolean;
  appointmentId?: string;
  onSuccess?: () => void;
  isAdmin?: boolean;
};

type TimeSlot = {
  timeSlotId: string;
  time: string;
};

type Client = {
  id: string;
  name: string | null;
  email: string | null;
};

const ScheduleAppointmentDialog: React.FC<ScheduleAppointmentDialogProps> = ({
  isOpen,
  onClose,
  isRescheduling = false,
  appointmentId,
  onSuccess,
  isAdmin = false,
}) => {
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<
    TimeSlot | undefined
  >(undefined);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClientId, setSelectedClientId] = useState<string>("");

  const [state, action, isPending] = useActionState(scheduleAppointment, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (isAdmin) {
      const fetchClients = async () => {
        try {
          const clientsList = await getAdminClients();
          setClients(clientsList);
        } catch (error) {
          console.error("Failed to fetch clients:", error);
          toast.error("Failed to load clients list");
        }
      };
      fetchClients();
    }
  }, [isAdmin]);

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

    if (isAdmin && !selectedClientId) {
      toast.error("Please select a client");
      return;
    }

    if (appointmentId) {
      formData.set("appointmentId", appointmentId);
    }

    if (isAdmin) {
      formData.set("clientId", selectedClientId);
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
          {isAdmin && (
            <div className="grid gap-2">
              <Label className="text-sm font-medium">Client</Label>
              <Select
                value={selectedClientId}
                onValueChange={setSelectedClientId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a client" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name || "Unnamed Client"}{" "}
                      {client.email ? `(${client.email})` : ""}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

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
              disabled={
                !date ||
                !selectedTimeSlot ||
                (isAdmin && !selectedClientId) ||
                isPending
              }
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
