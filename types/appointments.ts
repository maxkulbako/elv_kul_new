import { AppointmentStatus, OrderType, OrderStatus } from "@prisma/client";

export interface AppointmentBarDTO {
  id: string;
  date: Date;
  status: AppointmentStatus;
  repayUrl?: string | null;
  order?: { id: string; type: OrderType; status: OrderStatus } | null;
  packagePurchase?: {
    id: string;
    sessionsTotal: number;
    sessionsUsed: number;
  } | null;
}

export interface AppointmentCardDTO extends AppointmentBarDTO {
  client: { name: string };
  durationMin: number;
}
