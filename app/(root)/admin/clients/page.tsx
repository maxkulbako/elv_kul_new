import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, User, Trash } from "lucide-react";
import { requireAdminAuth } from "@/lib/auth/require-admin";
import { getAllClients } from "@/lib/actions/admin.acrion";
import { format } from "date-fns";
import SearchField from "./SearchField";

const ClientsPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  await requireAdminAuth();

  const query = (await searchParams).query;

  const clients = await getAllClients(query ? (query as string) : "");

  return (
    <div className="flex min-h-screen w-full">
      <div className="flex-1 p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold">Clients</h1>
              <p className="text-muted-foreground">
                Manage your client information and history
              </p>
            </div>
            <Button className="bg-olive-primary hover:bg-olive-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              Add New Client
            </Button>
          </div>

          <div className="flex items-center w-full max-w-sm">
            <SearchField />
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden md:table-cell">
                    Contact
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">Status</TableHead>
                  <TableHead>Sessions</TableHead>
                  <TableHead>Next Appointment</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clients.map((client) => (
                  <TableRow key={client.id}>
                    <TableCell className="font-medium">
                      <div className="flex items-center">
                        <div className="h-8 w-8 rounded-full bg-olive-primary/20 flex items-center justify-center mr-2">
                          {client.name?.charAt(0).toUpperCase()}
                        </div>
                        {client.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="max-w-[200px]">
                        <div className="truncate">{client.email}</div>
                      </div>
                    </TableCell>
                    {/* TODO: Add status */}
                    <TableCell className="hidden lg:table-cell">
                      <div
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          "active" === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        Active
                      </div>
                    </TableCell>
                    <TableCell>{client._count.appointments}</TableCell>
                    <TableCell>
                      {client.appointments[0]?.date
                        ? format(client.appointments[0]?.date, "MMM d, yyyy")
                        : "No appointments"}
                    </TableCell>
                    <TableCell>
                      {client.pricing[0]?.price
                        ? `$${client.pricing[0]?.price}`
                        : "Default"}
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          asChild
                          className="hover:bg-olive-primary/90 hover:text-white"
                        >
                          <Link href={`/admin/clients/${client.id}`}>
                            <User className="h-4 w-4" />
                            <span className="sr-only">View</span>
                          </Link>
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="cursor-pointer hover:bg-olive-primary/90 hover:text-white"
                        >
                          <Trash className="h-4 w-4" />
                          <span className="sr-only">Delete</span>
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientsPage;
