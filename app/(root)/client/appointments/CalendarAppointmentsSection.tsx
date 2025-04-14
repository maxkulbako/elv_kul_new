"use client";

import { useEffect, useState } from "react";
import { addWeeks, format, isSameDay, startOfWeek, addDays } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCalendarAppointments } from "@/lib/actions/appointment.action";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, ChevronLeft, ChevronRight, Video } from "lucide-react";
import ScheduleAppointmentClientWrapper from "@/components/shared/ScheduleAppointmentClientWrapper";
import { StatusBadge } from "./AppointmentsCard";
import { cn } from "@/lib/utils";
import { PaymentStatus, PricingType, SessionStatus } from "@prisma/client";

type Appointment = {
  id: string;
  date: Date;
  durationMin: number;
  status: SessionStatus;
  link: string | null;
  clientId: string;
  adminId: string;
  paymentStatus: PaymentStatus;
  price: number;
  pricingType: PricingType;
  createdAt: Date;
  updatedAt: Date;
};

export const CalendarAppointmentsSection = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [selectedAppointment, setSelectedAppointment] =
    useState<Appointment | null>(null);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const data = await getCalendarAppointments();
        setAppointments(data);
      } catch (err) {
        console.error(err);
      }
    };

    loadAppointments();
  }, []);

  const appointmentsForDay = appointments.filter((a) =>
    isSameDay(new Date(a.date), selectedDate)
  );

  const renderCalendarDays = () => {
    const startDate = startOfWeek(selectedDate);
    const days = [];

    for (let i = 0; i < 7; i++) {
      const day = addDays(startDate, i);
      const appointmentsOnDay = appointments.filter((a) =>
        isSameDay(new Date(a.date), day)
      );

      days.push(
        <div
          key={i}
          className={cn(
            "flex flex-col items-center p-2 border rounded-md cursor-pointer transition-all",
            isSameDay(day, new Date())
              ? "border-olive-primary bg-olive-primary/10"
              : "border-transparent hover:bg-olive-light",
            appointmentsOnDay.length > 0 && "ring-1 ring-olive-primary"
          )}
          onClick={() => setSelectedDate(day)}
        >
          <div className="text-sm font-medium mb-1">{format(day, "EEE")}</div>
          <div
            className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full",
              isSameDay(day, selectedDate) && "bg-olive-primary text-white"
            )}
          >
            {format(day, "d")}
          </div>
          {appointmentsOnDay.length > 0 && (
            <div className="mt-1 w-4 h-1 rounded-full bg-olive-primary"></div>
          )}
        </div>
      );
    }

    return <div className="flex justify-between mt-4 mb-6">{days}</div>;
  };

  const handleJoinVideoSession = () => {
    if (selectedAppointment?.link) {
      window.open(selectedAppointment.link, "_blank");
    }
  };

  const refreshAppointments = async () => {
    try {
      const data = await getCalendarAppointments();
      setAppointments(data);
    } catch (err) {
      console.error("Failed to refresh appointments:", err);
    }
  };

  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Appointment Calendar</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate(addWeeks(selectedDate, -1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <CalendarIcon className="h-4 w-4" />
                  <span>{format(selectedDate, "MMMM yyyy")}</span>
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="center">
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={(day) => day && setSelectedDate(day)}
                  initialFocus
                  className="p-3 pointer-events-auto"
                />
              </PopoverContent>
            </Popover>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setSelectedDate(addWeeks(selectedDate, 1))}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardDescription>
          Weekly view of your therapy appointments
        </CardDescription>
      </CardHeader>
      <CardContent>
        {renderCalendarDays()}

        <div className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-medium">
              Appointments for {format(selectedDate, "MMMM d, yyyy")}
            </h3>
            <ScheduleAppointmentClientWrapper onSuccess={refreshAppointments}>
              <Button
                variant="outline"
                className="border-olive-primary text-olive-primary"
              >
                Add Appointment
              </Button>
            </ScheduleAppointmentClientWrapper>
          </div>

          {appointmentsForDay.length > 0 ? (
            <div className="space-y-4">
              {appointmentsForDay.map((appointment) => (
                <div
                  key={appointment.id}
                  className="p-4 border border-muted rounded-lg hover:bg-olive-light transition-colors cursor-pointer"
                  onClick={() => setSelectedAppointment(appointment)}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-medium">Individual Therapy</h4>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(appointment.date), "h:mm a")} •{" "}
                        {appointment.durationMin} minutes
                      </p>
                    </div>
                    <StatusBadge status={appointment.status} />
                  </div>
                  {appointment.status === "SCHEDULED" && (
                    <div className="mt-4 flex gap-2 justify-end">
                      <ScheduleAppointmentClientWrapper
                        isRescheduling
                        existingDate={appointment.date}
                        appointmentId={appointment.id}
                        onSuccess={refreshAppointments}
                      >
                        <Button variant="outline" size="sm">
                          Reschedule
                        </Button>
                      </ScheduleAppointmentClientWrapper>
                      <Button
                        size="sm"
                        className="bg-olive-primary hover:bg-olive-primary/90"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleJoinVideoSession();
                        }}
                      >
                        <Video className="mr-2 h-4 w-4" />
                        Join
                      </Button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 border border-dashed border-muted rounded-lg">
              <p className="text-muted-foreground mb-4">
                No appointments for this day
              </p>
              <ScheduleAppointmentClientWrapper>
                <Button className="bg-olive-primary hover:bg-olive-primary/90">
                  Schedule Appointment
                </Button>
              </ScheduleAppointmentClientWrapper>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
