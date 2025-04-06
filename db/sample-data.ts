import { Prisma } from "@prisma/client";

export const sampleUsersData: Prisma.UserCreateInput[] = [
  {
    name: "Elvida Kulbako",
    email: "elvida@gmail.com",
    role: "ADMIN",
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "CLIENT",
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "CLIENT",
  },
];
