"use server";

import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

import { TimeSlot } from "@/app/(root)/admin/calendar/AvailabilityManager";
import { endOfDay, startOfDay } from "date-fns";
import { AppointmentStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { AppointmentCardDTO } from "@/types/appointments";

export async function getAdminAppointments(
  take?: number,
  year?: number,
  month?: number,
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const today = new Date();
  const startDate =
    year !== undefined && month !== undefined
      ? new Date(year, month, 1)
      : new Date(today.getFullYear(), today.getMonth(), 1);

  const endDate =
    year !== undefined && month !== undefined
      ? new Date(year, month + 1, 0)
      : new Date(today.getFullYear(), today.getMonth() + 1, 0);

  const appointments = await prisma.appointment.findMany({
    where: {
      adminId: session.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
    },
    orderBy: {
      date: "asc",
    },
    take: take,
    include: {
      client: {
        select: {
          name: true,
        },
      },
    },
  });
  console.log(appointments);

  // Convert Decimal to number for serialization
  return appointments.map((appointment) => ({
    ...appointment,
    price: appointment.priceApplied ? Number(appointment.priceApplied) : null,
  }));
}

export async function getUpcommingAppointments(
  numberOfAppointments: number,
): Promise<AppointmentCardDTO[]> {
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
    take: numberOfAppointments,
    include: {
      client: { select: { name: true } },
      order: { select: { id: true, type: true, status: true, repayUrl: true } },
      packagePurchase: {
        select: { id: true, sessionsTotal: true, sessionsUsed: true },
      },
    },
  });

  return appointments.map((a) => ({
    id: a.id,
    date: a.date,
    status: a.status,
    repayUrl: a.order?.repayUrl ?? null,
    order: a.order
      ? { id: a.order.id, type: a.order.type, status: a.order.status }
      : null,
    packagePurchase: a.packagePurchase
      ? {
          id: a.packagePurchase.id,
          sessionsTotal: a.packagePurchase.sessionsTotal,
          sessionsUsed: a.packagePurchase.sessionsUsed,
        }
      : null,
    client: { name: a.client.name || "Unknown Client" },
    durationMin: a.durationMin,
  }));
}

export async function getAppointmentDTO(
  id: string,
): Promise<AppointmentCardDTO | null> {
  const a = await prisma.appointment.findUnique({
    where: { id },
    include: {
      client: { select: { name: true } },
      order: {
        select: { id: true, type: true, status: true, repayUrl: true },
      },
      packagePurchase: {
        select: { id: true, sessionsTotal: true, sessionsUsed: true },
      },
    },
  });
  if (!a) return null;
  return {
    id: a.id,
    date: a.date,
    status: a.status,
    repayUrl: a.order?.repayUrl ?? null,
    order: a.order
      ? { id: a.order.id, type: a.order.type, status: a.order.status }
      : null,
    packagePurchase: a.packagePurchase
      ? {
          id: a.packagePurchase.id,
          sessionsTotal: a.packagePurchase.sessionsTotal,
          sessionsUsed: a.packagePurchase.sessionsUsed,
        }
      : null,
    client: { name: a.client.name || "Unknown Client" },
    durationMin: a.durationMin,
  };
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
        orderBy: {
          date: "desc",
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
  _prevState: unknown,
  formData: FormData,
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
      formData.get("timeSlots") as string,
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
      existingSlots.map((slot) => slot.date.getTime()),
    );

    // 4. Check booked slots
    const bookedSlots = await prisma.appointment.findMany({
      where: {
        adminId,
        date: { in: [...datesToCreate, ...datesToDelete] },
        status: {
          in: ["SCHEDULED"],
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
        !existingDates.has(date.getTime()) && !bookedDates.has(date.getTime()),
    );

    const datesToDeleteFiltered = datesToDelete.filter(
      (date) =>
        existingDates.has(date.getTime()) && !bookedDates.has(date.getTime()),
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
    console.error("Failed to update available slots:", error);
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

export async function getAdminAppointmentsDates(year: number, month: number) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const startDate = new Date(year, month, 1);
  const endDate = new Date(year, month + 1, 0);

  const appointments = await prisma.appointment.findMany({
    where: {
      adminId: session.user.id,
      date: {
        gte: startDate,
        lte: endDate,
      },
      status: {
        notIn: ["CANCELLED", "RESCHEDULED"],
      },
    },
    select: {
      date: true,
    },
    distinct: ["date"],
  });

  return appointments.map((appointment) => appointment.date);
}

export async function getAdminAppointmentsByDate(date: Date) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const startOfDay = new Date(date);
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const appointments = await prisma.appointment.findMany({
    where: {
      adminId: session.user.id,
      date: {
        gte: startOfDay,
        lte: endOfDay,
      },
      status: {
        notIn: ["CANCELLED", "RESCHEDULED"],
      },
    },
    select: {
      id: true,
      date: true,
      durationMin: true,
      status: true,
      clientId: true,
      client: {
        select: {
          name: true,
        },
      },
    },
  });

  return appointments.map((appointment) => ({
    ...appointment,
    clientName: appointment.client.name || "Unknown Client",
    type: "Individual Therapy", //TODO: add type to appointment model
  }));
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: AppointmentStatus,
) {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  try {
    await prisma.appointment.update({
      where: {
        id: appointmentId,
      },
      data: {
        status,
      },
    });

    revalidatePath("/admin/calendar");

    return {
      success: true,
      message: "Appointment status updated successfully",
    };
  } catch (error) {
    console.error("Failed to update appointment status:", error);
    return {
      success: false,
      message: "Failed to update appointment status",
    };
  }
}

export async function getAdminClients() {
  const session = await auth();
  if (!session?.user || session.user.role !== "ADMIN")
    throw new Error("Unauthorized");

  const clients = await prisma.user.findMany({
    where: {
      role: "CLIENT",
    },
    select: {
      id: true,
      name: true,
      email: true,
    },
    orderBy: {
      name: "asc",
    },
  });

  return clients;
}
