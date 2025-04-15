import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Calendar,
  Save,
  ArrowLeft,
  Phone,
  Mail,
  Video,
  Tag,
} from "lucide-react";
import Link from "next/link";
import { format, formatDate } from "date-fns";
import { getClientById } from "@/lib/actions/admin.acrion";
// Mock client data
const clientsData = {
  "1": {
    id: "1",
    name: "Alex Johnson",
    email: "alex@example.com",
    phone: "(555) 123-4567",
    dateOfBirth: "1985-06-15",
    address: "123 Main St, Anytown, CA 12345",
    occupation: "Software Engineer",
    emergencyContact: "Jennifer Johnson, (555) 987-6543",
    status: "active",
    sessions: 12,
    nextAppointment: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    customPrice: 120,
    paymentMethod: "Credit Card ending in 4242",
    insuranceInfo: "BlueCross BlueShield, Policy #BC12345678",
    referralSource: "Online Search",
    registrationDate: new Date("2022-03-15"),
    notes: [
      {
        id: "n1",
        date: new Date("2023-04-10"),
        content:
          "Initial consultation. Client presents with mild anxiety symptoms related to work stress. Recommended mindfulness practices and scheduled weekly sessions.",
        tags: ["anxiety", "work stress"],
      },
      {
        id: "n2",
        date: new Date("2023-04-17"),
        content:
          "Follow-up session. Client reports implementing mindfulness techniques with some success. Still experiencing sleep disturbances. Discussed sleep hygiene strategies.",
        tags: ["anxiety", "sleep issues"],
      },
      {
        id: "n3",
        date: new Date("2023-04-24"),
        content:
          "Client reports improvement in sleep quality. Continuing to work on stress management techniques. Discussed cognitive restructuring for negative thought patterns.",
        tags: ["progress", "cognitive work"],
      },
    ],
    appointments: [
      {
        id: "a1",
        date: new Date("2023-04-10T10:00:00"),
        type: "Initial Consultation",
        status: "completed",
        duration: 60,
        notes: "First session, established rapport",
      },
      {
        id: "a2",
        date: new Date("2023-04-17T10:00:00"),
        type: "Individual Therapy",
        status: "completed",
        duration: 50,
        notes: "Follow-up on mindfulness practices",
      },
      {
        id: "a3",
        date: new Date("2023-04-24T10:00:00"),
        type: "Individual Therapy",
        status: "completed",
        duration: 50,
        notes: "Cognitive restructuring techniques",
      },
      {
        id: "a4",
        date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        type: "Individual Therapy",
        status: "scheduled",
        duration: 50,
        notes: "",
      },
    ],
  },
  // Add other clients as needed
};

const ClientDetailPage = async ({
  params,
}: {
  params: { clientID: string };
}) => {
  const { clientID } = params;

  // In a real app, you would fetch this data from an API
  // const client = clientID
  //   ? clientsData[clientID as keyof typeof clientsData]
  //   : null;

  // if (!client) {
  //   return <div>Client not found</div>;
  // }

  const client = await getClientById(clientID);

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-6 overflow-y-auto">
        <div className="flex flex-col space-y-6">
          <div className="flex items-center">
            <Button variant="ghost" size="sm" className="mr-2" asChild>
              <Link href="/admin/clients">
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back to Clients
              </Link>
            </Button>
          </div>

          <div className="flex items-start justify-between">
            <div className="flex items-center">
              <div className="h-16 w-16 rounded-full bg-olive-primary flex items-center justify-center text-white text-2xl mr-4">
                {client?.name?.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-semibold">{client?.name}</h1>
                <div className="flex items-center mt-1 text-muted-foreground">
                  <Mail className="h-4 w-4 mr-1" />
                  <span className="mr-4">{client?.email}</span>
                  {/* <Phone className="h-4 w-4 mr-1" />
                  <span>{client?.phone}</span> */}
                </div>
              </div>
            </div>
            <div className="flex space-x-2">
              <Button variant="outline" className="bg-white">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" className="bg-white">
                <Mail className="h-4 w-4 mr-2" />
                Email
              </Button>
              <Button className="bg-olive-primary hover:bg-olive-primary/90">
                <Video className="h-4 w-4 mr-2" />
                Start Session
              </Button>
            </div>
          </div>

          <Tabs defaultValue="profile" className="w-full">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="notes">Session Notes</TabsTrigger>
              <TabsTrigger value="appointments">Appointments</TabsTrigger>
              <TabsTrigger value="billing">Billing</TabsTrigger>
            </TabsList>

            <TabsContent value="profile" className="mt-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Personal Information</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <div className="text-sm font-medium">Date of Birth</div>
                        <div>15 Jun 1985</div> {/* TODO: add date of birth */}
                      </div>
                      <div>
                        <div className="text-sm font-medium">Occupation</div>
                        <div>Software Engineer</div>{" "}
                        {/* TODO: add occupation */}
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium">Address</div>
                        <div>Sant Lui, Barcelona</div> {/* TODO: add address */}
                      </div>
                      <div className="md:col-span-2">
                        <div className="text-sm font-medium">
                          Emergency Contact
                        </div>
                        <div>+1 234 567 890</div>{" "}
                        {/* TODO: add emergency contact */}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Edit Information
                    </Button>
                  </CardFooter>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Client Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="text-sm font-medium">Status</div>
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          "active" === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        Active
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Total Sessions</div>
                      <div>{client?._count.appointments}</div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Next Appointment
                      </div>
                      <div>
                        {client?.appointments[0]?.date
                          ? format(client.appointments[0].date, "MMM d, yyyy")
                          : "N/A"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">Custom Price</div>
                      <div>
                        {client?.pricing[0]?.price
                          ? `$${client.pricing[0].price} per session`
                          : "Default pricing"}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm font-medium">
                        Registration Date
                      </div>
                      <div>
                        {client?.createdAt
                          ? format(client.createdAt, "MMM d, yyyy")
                          : "N/A"}
                      </div>
                    </div>
                    {/* <div>
                      <div className="text-sm font-medium">Referral Source</div>
                      <div>{client.referralSource}</div>
                    </div> */}
                  </CardContent>
                  <CardFooter>
                    <Button variant="outline" className="w-full">
                      Update Status
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="notes" className="mt-6 space-y-6">
              Session Notes
              {/* <Card>
                <CardHeader>
                  <CardTitle>Add Session Note</CardTitle>
                  <CardDescription>
                    Document your observations from the session
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Textarea
                    placeholder="Enter your session notes here..."
                    className="min-h-[150px]"
                  />
                  <div className="flex items-center space-x-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Add tags separated by commas (e.g., anxiety, progress)" />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button className="bg-olive-primary hover:bg-olive-primary/90">
                    <Save className="h-4 w-4 mr-2" />
                    Save Note
                  </Button>
                </CardFooter>
              </Card>

              <div className="space-y-6">
                <h3 className="text-lg font-medium">Previous Notes</h3>
                {client.notes.map((note) => (
                  <Card key={note.id}>
                    <CardHeader className="pb-2">
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base">
                          {format(note.date, "MMM d, yyyy")}
                        </CardTitle>
                        <Button variant="ghost" size="sm">
                          Edit
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="whitespace-pre-line">{note.content}</p>
                      <div className="flex mt-4 flex-wrap gap-1">
                        {note.tags.map((tag) => (
                          <div
                            key={tag}
                            className="bg-olive-light text-olive-primary text-xs px-2 py-1 rounded-full"
                          >
                            {tag}
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div> */}
            </TabsContent>

            <TabsContent value="appointments" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle>Appointment History</CardTitle>
                    <Button className="bg-olive-primary hover:bg-olive-primary/90">
                      Schedule New
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {client?.appointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="flex items-center justify-between p-4 border rounded-md"
                      >
                        <div>
                          <div className="flex items-center">
                            <Calendar className="h-5 w-5 mr-2 text-olive-primary" />
                            <span className="font-medium">
                              {format(appointment.date, "MMM d, yyyy")}
                            </span>
                          </div>
                          <div className="text-sm text-muted-foreground mt-1">
                            "Individual Therapy" • {appointment.durationMin}{" "}
                            {/* TODO: add appointment type */}
                            minutes
                          </div>
                          {/* {appointment.notes && (
                            <div className="text-sm mt-2 italic">
                              {appointment.notes}
                            </div>
                          )} */}
                        </div>
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium ${
                            appointment.status === "COMPLETED"
                              ? "bg-green-100 text-green-800"
                              : appointment.status === "SCHEDULED"
                              ? "bg-blue-100 text-blue-800"
                              : appointment.status === "CANCELLED"
                              ? "bg-red-100 text-red-800"
                              : "bg-gray-100 text-gray-800"
                          }`}
                        >
                          {appointment.status.charAt(0).toUpperCase() +
                            appointment.status.slice(1)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="billing" className="mt-6 space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Billing Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="text-sm font-medium">Custom Price</div>
                    <div className="flex items-center justify-between">
                      <div>
                        {client?.pricing[0]?.price
                          ? `$${client.pricing[0].price} per session`
                          : "Default pricing"}
                      </div>
                      <Button variant="outline" size="sm">
                        Adjust Price
                      </Button>
                    </div>
                  </div>

                  <div>
                    <div className="text-sm font-medium">Payment Method</div>
                    <div>Card ending in 4242</div>{" "}
                    {/* TODO: add payment method */}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Payment History</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-6 text-muted-foreground">
                    Payment history will appear here when available
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
