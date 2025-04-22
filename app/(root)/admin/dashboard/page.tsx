import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Users, Clock, CreditCard, Video } from "lucide-react";
import { auth } from "@/auth";
import UpcomingSessionsSection from "./UpcomingSessionsSection";
import { format } from "date-fns";

// Mock data for upcoming appointments
const upcomingAppointments = [
  {
    id: "1",
    clientName: "Alex Johnson",
    date: new Date(Date.now() + 2 * 60 * 60 * 1000),
    time: "10:00 AM",
    duration: 50,
    type: "Individual Therapy",
    paymentStatus: "paid",
  },
  {
    id: "2",
    clientName: "Maria Garcia",
    date: new Date(Date.now() + 5 * 60 * 60 * 1000),
    time: "2:30 PM",
    duration: 50,
    type: "Initial Consultation",
    paymentStatus: "pending",
  },
  {
    id: "3",
    clientName: "James Wilson",
    date: new Date(Date.now() + 8 * 60 * 60 * 1000),
    time: "4:15 PM",
    duration: 50,
    type: "Follow-up Session",
    paymentStatus: "paid",
  },
];

// Mock data for client stats
const totalClients = 27;
const newClientsThisMonth = 4;
const activeClients = 18;
const averageRating = 4.8;

// Mock revenue data
const revenueData = {
  totalThisMonth: 4250,
  comparisonLastMonth: 12,
  sessionsThisMonth: 34,
  comparisonSessionsLastMonth: 8,
  averageSessionPrice: 125,
};

const AdminDashboardPage: React.FC = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <>
      <div className="flex min-h-screen w-full">
        <div className="flex-1 p-6">
          <div className="flex flex-col space-y-8">
            <div>
              <h1 className="text-2xl font-semibold">Psychologist Dashboard</h1>
              <p className="text-muted-foreground">
                Welcome back, Dr. {user?.name}. Here's an overview of your
                practice.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Total Clients
                      </p>
                      <p className="text-2xl font-semibold">{totalClients}</p>
                      <p className="text-sm text-olive-primary">
                        +{newClientsThisMonth} this month
                      </p>
                    </div>
                    <Users className="h-10 w-10 text-olive-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Monthly Revenue
                      </p>
                      <p className="text-2xl font-semibold">
                        ${revenueData.totalThisMonth}
                      </p>
                      <p className="text-sm text-olive-primary">
                        +{revenueData.comparisonLastMonth}% vs last month
                      </p>
                    </div>
                    <CreditCard className="h-10 w-10 text-olive-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Sessions This Month
                      </p>
                      <p className="text-2xl font-semibold">
                        {revenueData.sessionsThisMonth}
                      </p>
                      <p className="text-sm text-olive-primary">
                        +{revenueData.comparisonSessionsLastMonth}% vs last
                        month
                      </p>
                    </div>
                    <Clock className="h-10 w-10 text-olive-primary" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Next Session
                      </p>
                      <p className="text-2xl font-semibold">
                        {format(upcomingAppointments[0].date, "HH:mm")}
                      </p>
                      <p className="text-sm text-olive-primary">
                        {upcomingAppointments[0].clientName}
                      </p>
                    </div>
                    <Video className="h-10 w-10 text-olive-primary" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <UpcomingSessionsSection />
              <Card>
                <CardHeader>
                  <CardTitle>Client Insights</CardTitle>
                  <CardDescription>
                    Overview of your client base
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Active Clients
                      </span>
                      <span className="font-medium">
                        {activeClients} / {totalClients}
                      </span>
                    </div>
                    <div className="w-full bg-olive-light rounded-full h-2.5">
                      <div
                        className="bg-olive-primary h-2.5 rounded-full"
                        style={{
                          width: `${(activeClients / totalClients) * 100}%`,
                        }}
                      ></div>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          Average Client Rating
                        </span>
                        <span className="font-medium">{averageRating}/5</span>
                      </div>
                      <div className="flex">
                        {Array(5)
                          .fill(0)
                          .map((_, i) => (
                            <svg
                              key={i}
                              className={`w-5 h-5 ${
                                i < Math.floor(averageRating)
                                  ? "text-yellow-400"
                                  : "text-gray-300"
                              }`}
                              fill="currentColor"
                              viewBox="0 0 20 20"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                            </svg>
                          ))}
                      </div>
                    </div>

                    <div className="pt-4">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-muted-foreground">
                          Average Session Price
                        </span>
                        <span className="font-medium">
                          ${revenueData.averageSessionPrice}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboardPage;
