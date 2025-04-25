import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Phone, Mail, Video } from "lucide-react";
import Link from "next/link";
import { getClientById } from "@/lib/actions/admin.action";
import ProfileTab from "./ProfileTab";
import SessionNotesTab from "./SessionNotesTab";
import AppointmentsTab from "./AppointmentsTab";
import BilingTab from "./BilingTab";

export type Client = Awaited<ReturnType<typeof getClientById>>;

const ClientDetailPage = async ({
  params,
}: {
  params: Promise<{ clientID: string }>;
}) => {
  const { clientID } = await params;

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
                  <Phone className="h-4 w-4 mr-1" />
                  <span>{client?.phone || "N/A"}</span>
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
              <ProfileTab client={client} />
            </TabsContent>

            <TabsContent value="notes" className="mt-6 space-y-6">
              <SessionNotesTab />
            </TabsContent>

            <TabsContent value="appointments" className="mt-6 space-y-6">
              <AppointmentsTab client={client} />
            </TabsContent>

            <TabsContent value="billing" className="mt-6 space-y-6">
              <BilingTab client={client} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default ClientDetailPage;
