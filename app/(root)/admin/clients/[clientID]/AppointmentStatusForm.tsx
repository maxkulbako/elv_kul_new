"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { updateAppointmentStatusFormSchema } from "@/lib/validations";
import { UpdateAppointmentStatusFormValues } from "@/types";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils/utils";
import { Button } from "@/components/ui/button";
import { Save, X } from "lucide-react";
import { updateAppointmentStatus } from "@/lib/actions/admin.action";
import { useTransition } from "react";
import { AppointmentStatus } from "@prisma/client";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { cancelAppointment } from "@/lib/actions/appointment.action";

const AppointmentStatusForm = ({
  initialStatus,
  appointmentId,
}: {
  initialStatus: string;
  appointmentId: string;
}) => {
  const form = useForm<UpdateAppointmentStatusFormValues>({
    resolver: zodResolver(updateAppointmentStatusFormSchema),
    defaultValues: {
      status: initialStatus,
    },
  });
  const [isPending, startTransition] = useTransition();

  const handleChangeStatus = (data: UpdateAppointmentStatusFormValues) => {
    if (data.status === initialStatus) {
      toast.error("Status is already the same", { richColors: true });
      return;
    }

    if (data.status === "CANCELLED") {
      startTransition(async () => {
        const data = new FormData();
        data.append("appointmentId", appointmentId);

        const res = await cancelAppointment("", data);
        if (res.success) {
          toast.success(res.message, { richColors: true });
        } else {
          toast.error(res.message, { richColors: true });
        }
      });
    } else {
      startTransition(async () => {
        const res = await updateAppointmentStatus(
          appointmentId,
          data.status as AppointmentStatus,
        );
        if (res.success) {
          toast.success(res.message, { richColors: true });
        } else {
          toast.error(res.message, { richColors: true });
        }
      });
    }
  };

  const getStatusStyles = (status: string) => {
    switch (status) {
      case "COMPLETED":
        return "bg-green-100 text-green-800";
      case "SCHEDULED":
        return "bg-blue-100 text-blue-800";
      case "CANCELLED":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleChangeStatus)}
        className="flex gap-2"
      >
        <Button
          variant="outline"
          type="button"
          onClick={() => {
            form.reset();
          }}
        >
          <X className="w-4 h-4" />
        </Button>
        <Button
          variant="outline"
          type="submit"
          disabled={isPending || initialStatus === form.watch("status")}
        >
          {isPending ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
        </Button>
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger
                    className={cn(
                      "px-3 py-1 rounded-full text-xs font-medium",
                      getStatusStyles(field.value),
                    )}
                  >
                    <SelectValue>
                      {field.value.charAt(0).toUpperCase() +
                        field.value.slice(1).toLowerCase()}
                    </SelectValue>
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                  <SelectItem value="COMPLETED">Completed</SelectItem>
                  <SelectItem value="CANCELLED">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
};

export default AppointmentStatusForm;
