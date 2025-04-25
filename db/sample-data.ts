import { Prisma } from "@prisma/client";
import { hashSync } from "bcrypt-ts-edge";

export const sampleUsersData: Prisma.UserCreateInput[] = [
  {
    name: "Elvida Kulbako",
    email: "elvida@gmail.com",
    role: "ADMIN",
    password: hashSync("password", 10),
  },
  {
    name: "John Doe",
    email: "john.doe@example.com",
    role: "CLIENT",
    password: hashSync("password", 10),
  },
  {
    name: "Jane Smith",
    email: "jane.smith@example.com",
    role: "CLIENT",
    password: hashSync("password", 10),
  },
];
