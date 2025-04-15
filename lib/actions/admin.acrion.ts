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

export async function getAllClients(query: string = "") {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const clients = await prisma.user.findMany({
    where: {
      role: "CLIENT",
      name: {
        contains: query,
        mode: "insensitive",
      },
    },
    select: {
      id: true,
      name: true,
      email: true,
      _count: {
        select: {
          appointments: true,
        },
      },
      appointments: {
        where: {
          date: {
            gte: new Date(),
          },
        },
        orderBy: {
          date: "asc",
        },
        take: 1,
        select: {
          id: true,
          date: true,
          durationMin: true,
          status: true,
        },
      },
      pricing: {
        where: {
          isActive: true,
        },
        select: {
          price: true,
          packagePrice: true,
          packageSize: true,
        },
        take: 1,
      },
    },
    orderBy: {
      name: "asc",
    },
  });

  if (!clients) throw new Error("No clients found");

  return clients;
}
