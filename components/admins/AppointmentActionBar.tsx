"use client";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { AppointmentBarDTO } from "@/types/appointments";
import {
  Video,
  Info,
  CalendarClock,
  X,
  CheckCircle,
  DollarSign,
  RotateCcw,
  Clock,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";

export interface AppointmentActionBarProps {
  appointment: AppointmentBarDTO;
  /** where the bar is rendered */
  view: "dashboard" | "calendar" | "details";
  /** start reschedule flow */
  onReschedule?: (id: string) => void;
}

const AppointmentActionBar: React.FC<AppointmentActionBarProps> = ({
  appointment,
  view,
  onReschedule,
}) => {
  const isFinalStatus = [
    "CANCELLED",
    "COMPLETED",
    "COMPLETED_AND_REFUNDED",
  ].includes(appointment.status);

  if (isFinalStatus && view !== "details") return null;

  return (
    <div className="flex gap-2 items-center text-sm">
      <TooltipProvider>
        {/* Join button - always visible */}
        <JoinButton appointmentId={appointment.id} />

        {/* Details button - always visible */}
        {view !== "details" && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href={`/admin/appointments/${appointment.id}/details`}>
                <Info className="h-4 w-4" />
              </Link>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Details</p>
            </TooltipContent>
          </Tooltip>
        )}

        {/* Reschedule button - conditional */}
        {(view === "calendar" || view === "details") &&
          !isFinalStatus &&
          onReschedule && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onReschedule(appointment.id)}
                >
                  <CalendarClock className="h-4 w-4" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Reschedule</p>
              </TooltipContent>
            </Tooltip>
          )}

        {/* Cancel button - conditional */}
        {(view === "calendar" || view === "details") && !isFinalStatus && (
          <CancelButton appointmentId={appointment.id} />
        )}

        {/* Mark Completed button - conditional */}
        {view === "details" &&
          ["PAID", "PAID_FROM_PACKAGE"].includes(appointment.status) && (
            <MarkCompletedButton appointmentId={appointment.id} />
          )}

        {/* Refund Payment button - conditional */}
        {view === "details" &&
          appointment.order?.type === "SINGLE_SESSION" &&
          appointment.order?.status === "SUCCEEDED" && (
            <RefundButton appointmentId={appointment.id} />
          )}

        {/* Return Session button - conditional */}
        {view === "details" && appointment.status === "PAID_FROM_PACKAGE" && (
          <ReturnSessionButton appointmentId={appointment.id} />
        )}

        {/* Info badge for retry payment - conditional */}
        {appointment.status === "PENDING_PAYMENT" && appointment.repayUrl && (
          <RetryPaymentButton repayUrl={appointment.repayUrl} />
        )}
      </TooltipProvider>
    </div>
  );
};

// Placeholder functions for server actions (to be replaced with actual implementations)
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const joinCall = async (appointmentId: string) => {
  // Placeholder function - replace with actual implementation
  return Promise.resolve({ success: true });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const cancelAppointmentTx = async (appointmentId: string) => {
  // Placeholder function - replace with actual implementation
  return Promise.resolve({ success: true });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const markCompletedTx = async (appointmentId: string) => {
  // Placeholder function - replace with actual implementation
  return Promise.resolve({ success: true });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const refundSingleSessionTx = async (appointmentId: string) => {
  // Placeholder function - replace with actual implementation
  return Promise.resolve({ success: true });
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const returnSessionToPackageTx = async (appointmentId: string) => {
  // Placeholder function - replace with actual implementation
  return Promise.resolve({ success: true });
};

// Join Button
const JoinButton = ({ appointmentId }: { appointmentId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleJoin = () => {
    startTransition(() => {
      joinCall(appointmentId)
        .then(() => console.log("succsecc join meeting"))
        .catch((error) => console.log("error join meeting", error));
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleJoin}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Video className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Join Video Call</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Cancel Button
const CancelButton = ({ appointmentId }: { appointmentId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleCancel = () => {
    startTransition(() => {
      cancelAppointmentTx(appointmentId)
        .then(() => console.log("succsecc cancel appointment"))
        .catch((error) => console.log("error cancel appointment", error));
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="destructive"
          size="icon"
          className="h-8 w-8"
          onClick={handleCancel}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <X className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Cancel Appointment</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Mark Completed Button
const MarkCompletedButton = ({ appointmentId }: { appointmentId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleMarkComplete = () => {
    startTransition(() => {
      markCompletedTx(appointmentId)
        .then(() => console.log("succsecc mark completed"))
        .catch((error) => console.log("error mark completed", error));
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 text-green-700"
          onClick={handleMarkComplete}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <CheckCircle className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Mark as Completed</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Refund Button
const RefundButton = ({ appointmentId }: { appointmentId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleRefund = () => {
    startTransition(() => {
      refundSingleSessionTx(appointmentId)
        .then(() => console.log("succsecc refund payment"))
        .catch((error) => console.log("error refund payment", error));
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleRefund}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <DollarSign className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Refund Payment</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Return Session Button
const ReturnSessionButton = ({ appointmentId }: { appointmentId: string }) => {
  const [isPending, startTransition] = useTransition();

  const handleReturnSession = () => {
    startTransition(() => {
      returnSessionToPackageTx(appointmentId)
        .then(() => console.log("succsecc return session to package"))
        .catch((error) =>
          console.log("error return session to package", error),
        );
    });
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={handleReturnSession}
          disabled={isPending}
        >
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RotateCcw className="h-4 w-4" />
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Return Session to Package</p>
      </TooltipContent>
    </Tooltip>
  );
};

// Retry Payment Button
const RetryPaymentButton = ({ repayUrl }: { repayUrl: string }) => {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => window.open(repayUrl, "_blank")}
        >
          <Clock className="h-4 w-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <p>Retry Payment</p>
      </TooltipContent>
    </Tooltip>
  );
};

export default AppointmentActionBar;
