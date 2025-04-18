"use client";

import { useState, useEffect, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { Calendar, Loader2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { format } from "date-fns";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  createOrUpdateAvailableSlots,
  getAvailableSlotsByDate,
} from "@/lib/actions/admin.acrion";
import { toast } from "sonner";

export interface TimeSlot {
  time: string;
  available: boolean;
}

export function AvailabilityManager() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { time: "9:00", available: false },
    { time: "10:00", available: false },
    { time: "11:00", available: false },
    { time: "14:00", available: false },
    { time: "15:00", available: false },
    { time: "16:00", available: false },
    { time: "17:00", available: false },
    { time: "18:00", available: false },
  ]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchSlots = async () => {
      if (!selectedDate) return;

      const existingSlots = await getAvailableSlotsByDate(selectedDate);

      setTimeSlots((prevSlots) =>
        prevSlots.map((slot) => ({
          ...slot,
          available: existingSlots.some((s) => s.time === slot.time),
        }))
      );
    };

    fetchSlots();
  }, [selectedDate]);

  const toggleTimeSlot = (time: string) => {
    setTimeSlots((slots) =>
      slots.map((slot) =>
        slot.time === time ? { ...slot, available: !slot.available } : slot
      )
    );
  };

  const handleSave = async () => {
    if (!selectedDate) return;
    const formData = new FormData();
    formData.append("date", selectedDate.toISOString());
    formData.append("timeSlots", JSON.stringify(timeSlots));

    startTransition(async () => {
      const result = await createOrUpdateAvailableSlots(null, formData);

      if (result?.success) {
        toast.success(result.message, {
          richColors: true,
        });
      } else if (result?.message) {
        toast.error(result.message, {
          richColors: true,
        });
      }
    });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="default" className="bg-olive-primary">
          <Calendar className="h-4 w-4 mr-2" />
          Manage Availability
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-white">
        <DialogHeader>
          <DialogTitle>Set Available Time Slots</DialogTitle>
          <DialogDescription>
            Select dates and times when you're available for appointments
          </DialogDescription>
        </DialogHeader>

        <div className="flex flex-col gap-4 w-full">
          <div className="flex justify-center w-full">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border border-olive-primary/20 w-full"
            />
          </div>

          {selectedDate && (
            <>
              <h4 className="font-medium text-olive-primary">
                Time slots for {format(selectedDate, "PPPP")}:
              </h4>
              <div className="grid grid-cols-2 gap-4">
                {timeSlots.map((slot) => (
                  <div key={slot.time} className="flex items-center gap-2">
                    <Switch
                      checked={slot.available}
                      onCheckedChange={() => toggleTimeSlot(slot.time)}
                      className="data-[state=checked]:bg-olive-primary"
                    />
                    <Label className="text-olive-primary">{slot.time}</Label>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <form action={handleSave}>
          <DialogFooter>
            <Button
              type="submit"
              className="bg-olive-primary hover:bg-olive-primary/90 w-[150px]"
              disabled={isPending}
            >
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Availability"
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
