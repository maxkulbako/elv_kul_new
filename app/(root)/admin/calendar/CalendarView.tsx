"use client";

import React, { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import { Calendar as CalendarIcon, Video, User } from "lucide-react";
import { AvailabilityManager } from "./AvailabilityManager";
import {
  getAdminAppointmentsDates,
  getAdminAppointmentsByDate,
} from "@/lib/actions/admin.acrion";
import { SessionStatus } from "@prisma/client";

interface Session {
  id: string;
  clientName: string;
  clientId: string;
  date: Date;
  durationMin: number;
  type: string;
  status: SessionStatus;
}

interface CalendarViewProps {
  initialDates: Date[];
}

const CalendarView: React.FC<CalendarViewProps> = ({ initialDates }) => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [videoSessionOpen, setVideoSessionOpen] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<Session | null>(null);
  const [sessions, setSessions] = useState<Session[]>([]);
  const [datesWithSessions, setDatesWithSessions] =
    useState<Date[]>(initialDates);
  const [isPending, startTransition] = useTransition();

  // Load sessions for selected date
  useEffect(() => {
    if (selectedDate) {
      startTransition(async () => {
        const appointments = await getAdminAppointmentsByDate(selectedDate);
        setSessions(appointments);
      });
    }
  }, [selectedDate]);

  // Handle starting a video session
  const handleStartSession = (session: Session) => {
    setCurrentSession(session);
    setVideoSessionOpen(true);
  };

  const handleMonthChange = (date: Date) => {
    startTransition(async () => {
      const dates = await getAdminAppointmentsDates(
        date.getFullYear(),
        date.getMonth()
      );
      setDatesWithSessions(dates);
      setSessions([]); // Clear sessions when changing month
    });
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between flex-wrap">
            <div>
              <h1 className="text-2xl font-semibold">Calendar</h1>
              <p className="text-muted-foreground">
                Manage your appointments and schedule
              </p>
            </div>
            <div>
              <AvailabilityManager />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <Card className="col-span-1">
              <CardHeader>
                <CardTitle>Select Date</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  onMonthChange={handleMonthChange}
                  className="rounded-md border"
                  modifiers={{
                    withSessions: (day: Date) =>
                      datesWithSessions.some((date) => isSameDay(date, day)),
                  }}
                  modifiersClassNames={{
                    withSessions: "bg-olive-primary/20",
                  }}
                  defaultMonth={new Date()}
                />
              </CardContent>
            </Card>

            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>
                  {selectedDate
                    ? format(selectedDate, "EEEE, MMMM d, yyyy")
                    : "No Date Selected"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isPending ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading appointments...
                  </div>
                ) : sessions.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments scheduled for this date
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessions.map((session) => (
                      <div
                        key={session.id}
                        className="flex items-center justify-between p-4 bg-olive-light rounded-lg"
                      >
                        <div className="flex items-center">
                          <div className="w-12 h-12 bg-olive-primary text-white rounded-full flex items-center justify-center mr-4">
                            {session.clientName.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <h4 className="font-medium">
                              {session.clientName}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {format(session.date, "h:mm a")} •{" "}
                              {session.durationMin} minutes
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/clients/${session.clientId}`}>
                              <User className="h-4 w-4 mr-2" />
                              Profile
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="bg-olive-primary text-white"
                            onClick={() => handleStartSession(session)}
                          >
                            <Video className="h-4 w-4 mr-2" />
                            Join
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;
