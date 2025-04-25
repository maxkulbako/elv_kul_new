import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { type Client } from "./page";

const ProfileTab = ({ client }: { client: Client }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Personal Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm font-medium">Date of Birth</div>
              <div>
                {client?.birthDate
                  ? format(client.birthDate, "MMM d, yyyy")
                  : "N/A"}
              </div>
            </div>
            <div>
              <div className="text-sm font-medium">Occupation</div>
              <div>{client?.profession || "N/A"}</div>
            </div>
          </div>
          <div>
            <div className="text-sm font-medium">Telegram</div>
            <div>{client?.telegram || "N/A"}</div>
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
            <div className="text-sm font-medium">Next Appointment</div>
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
            <div className="text-sm font-medium">Registration Date</div>
            <div>
              {client?.createdAt
                ? format(client.createdAt, "MMM d, yyyy")
                : "N/A"}
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline" className="w-full">
            Update Status
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default ProfileTab;
