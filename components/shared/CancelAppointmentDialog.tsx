import { cancelAppointment } from "@/lib/actions/appointment.action";
import { useEffect } from "react";
import { useActionState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

type CancelAppointmentDialogProps = {
  appointmentId: string;
  onSuccess: () => void;
  trigger: React.ReactNode;
};

const CancelAppointmentDialog: React.FC<CancelAppointmentDialogProps> = ({
  appointmentId,
  onSuccess,
  trigger,
}) => {
  const [state, action, isPending] = useActionState(cancelAppointment, {
    success: false,
    message: "",
  });

  useEffect(() => {
    if (state.success) {
      onSuccess();
    }
  }, [state.success, isPending]);

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <form action={action}>
          <input type="hidden" name="appointmentId" value={appointmentId} />
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction asChild>
              <button type="submit">Continue</button>
            </AlertDialogAction>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default CancelAppointmentDialog;
