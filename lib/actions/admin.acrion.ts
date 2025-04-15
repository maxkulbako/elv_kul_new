"use server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

export async function getAdminAppointments() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const appointments = await prisma.appointment.findMany({
    where: {
      adminId: session.user.id,
      date: {
        gte: new Date(),
      },
    },
    orderBy: {
      date: "asc",
    },
    take: 5,
    include: {
      client: {
        select: {
          name: true,
        },
      },
    },
  });

  return appointments;
}
