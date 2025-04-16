"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, isSameDay } from "date-fns";
import {
  Calendar as CalendarIcon,
  Video,
  User,
  ArrowRight,
  Clock,
} from "lucide-react";

// Mock session data
const sessionData = [
  {
    id: "1",
    clientName: "Alex Johnson",
    date: new Date(2025, 3, 12, 10, 0), // April 12, 2025, 10:00 AM
    duration: 50,
    type: "Individual Therapy",
    status: "scheduled",
  },
  {
    id: "2",
    clientName: "Maria Garcia",
    date: new Date(2025, 3, 12, 14, 30), // April 12, 2025, 2:30 PM
    duration: 50,
    type: "Initial Consultation",
    status: "scheduled",
  },
  {
    id: "3",
    clientName: "James Wilson",
    date: new Date(2025, 3, 13, 9, 0), // April 13, 2025, 9:00 AM
    duration: 50,
    type: "Follow-up Session",
    status: "scheduled",
  },
  {
    id: "4",
    clientName: "Sarah Lee",
    date: new Date(2025, 3, 14, 11, 0), // April 14, 2025, 11:00 AM
    duration: 50,
    type: "Individual Therapy",
    status: "scheduled",
  },
  {
    id: "5",
    clientName: "David Kim",
    date: new Date(2025, 3, 15, 16, 0), // April 15, 2025, 4:00 PM
    duration: 50,
    type: "Crisis Intervention",
    status: "scheduled",
  },
];

const AdminCalendarPage: React.FC = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(
    new Date()
  );
  const [videoSessionOpen, setVideoSessionOpen] = useState<boolean>(false);
  const [currentSession, setCurrentSession] = useState<any>(null);

  // Filter sessions for the selected date
  const sessionsForSelectedDate = selectedDate
    ? sessionData.filter((session) => isSameDay(session.date, selectedDate))
    : [];

  // Format time from date
  const formatSessionTime = (date: Date) => {
    return format(date, "h:mm a");
  };

  // Handle starting a video session
  const handleStartSession = (session: any) => {
    setCurrentSession(session);
    setVideoSessionOpen(true);
  };

  // Get date with highlighted sessions
  const getDayWithSessions = (day: Date) => {
    return sessionData.some((session) => isSameDay(session.date, day));
  };

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div>
            <h1 className="text-2xl font-semibold">Calendar</h1>
            <p className="text-muted-foreground">
              Manage your appointments and schedule
            </p>
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
                  className="rounded-md border"
                  modifiers={{
                    withSessions: (date) => getDayWithSessions(date),
                  }}
                  modifiersClassNames={{
                    withSessions: "bg-olive-primary/20",
                  }}
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
                {sessionsForSelectedDate.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    No appointments scheduled for this date
                  </div>
                ) : (
                  <div className="space-y-4">
                    {sessionsForSelectedDate.map((session) => (
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
                              {formatSessionTime(session.date)} •{" "}
                              {session.duration} minutes • {session.type}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <Button variant="outline" size="sm" asChild>
                            <Link href={`/admin/client/${session.id}`}>
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

    //   {videoSessionOpen && currentSession && (
    //     <VideoConversation
    //       isOpen={videoSessionOpen}
    //       onClose={() => setVideoSessionOpen(false)}
    //       psychologistName={currentSession.clientName}
    //     />
    //   )}
  );
};

export default AdminCalendarPage;
