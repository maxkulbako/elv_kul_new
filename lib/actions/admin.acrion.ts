"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { TimeSlot } from "@/app/(root)/admin/calendar/AvailabilityManager";
import { endOfDay, startOfDay } from "date-fns";

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

export const getClientById = async (id: string) => {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const client = await prisma.user.findUnique({
    where: {
      id,
    },
    select: {
      name: true,
      email: true,
      createdAt: true,
      phone: true,
      telegram: true,
      profession: true,
      birthDate: true,
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
  });

  return client;
};

export async function createOrUpdateAvailableSlots(
  _prevState: any,
  formData: FormData
) {
  const session = await auth();
  const adminId = session?.user?.id;

  if (!adminId) throw new Error("Unauthorized");

  try {
    // 1. Create arrays for adding and deleting
    const datesToCreate: Date[] = [];
    const datesToDelete: Date[] = [];

    // 2. Process each slot
    const timeSlots: TimeSlot[] = JSON.parse(
      formData.get("timeSlots") as string
    );
    const date: string = formData.get("date") as string;

    for (const slot of timeSlots) {
      const [hours, minutes] = slot.time.split(":").map(Number);
      const fullDate = new Date(date);
      fullDate.setHours(hours, minutes || 0, 0, 0);

      if (slot.available) {
        datesToCreate.push(fullDate);
      } else {
        datesToDelete.push(fullDate);
      }
    }

    // 3. Check existing records
    const existingSlots = await prisma.availableSlot.findMany({
      where: {
        adminId,
        date: { in: [...datesToCreate, ...datesToDelete] },
      },
      select: {
        date: true,
      },
    });

    const existingDates = new Set(
      existingSlots.map((slot) => slot.date.getTime())
    );

    // 4. Check booked slots
    const bookedSlots = await prisma.appointment.findMany({
      where: {
        adminId,
        date: { in: [...datesToCreate, ...datesToDelete] },
        status: {
          notIn: ["CANCELLED", "MISSED", "RESCHEDULED"],
        },
      },
      select: {
        date: true,
      },
    });

    const bookedDates = new Set(bookedSlots.map((slot) => slot.date.getTime()));

    // 5. Filter dates
    const datesToCreateFiltered = datesToCreate.filter(
      (date) =>
        !existingDates.has(date.getTime()) && !bookedDates.has(date.getTime())
    );

    const datesToDeleteFiltered = datesToDelete.filter(
      (date) =>
        existingDates.has(date.getTime()) && !bookedDates.has(date.getTime())
    );

    // 6. Perform operations in a transaction
    await prisma.$transaction(async (tx) => {
      if (datesToDeleteFiltered.length > 0) {
        await tx.availableSlot.deleteMany({
          where: {
            adminId,
            date: { in: datesToDeleteFiltered },
          },
        });
      }

      if (datesToCreateFiltered.length > 0) {
        await tx.availableSlot.createMany({
          data: datesToCreateFiltered.map((date) => ({
            adminId,
            date,
            duration: 50,
          })),
          skipDuplicates: true,
        });
      }
    });

    return {
      success: true,
      message: "Available slots updated successfully",
    };
  } catch (error) {
    return {
      success: false,
      message: "Failed to update available slots",
    };
  }
}

export async function getAvailableSlotsByDate(date: Date) {
  const session = await auth();
  if (!session?.user) throw new Error("Unauthorized");

  const slots = await prisma.availableSlot.findMany({
    where: {
      adminId: session.user.id,
      date: {
        gte: startOfDay(date),
        lte: endOfDay(date),
      },
    },
    select: {
      date: true,
    },
  });

  return slots.map((slot) => {
    const h = slot.date.getHours();
    const m = slot.date.getMinutes();
    return {
      time: `${h}:${m === 0 ? "00" : m}`,
    };
  });
}
