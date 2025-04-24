"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogTrigger,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { CircleCheck, Trash } from "lucide-react";
import { updatePackageTemplateStatusAction } from "@/lib/actions/price.action";
import { useTransition } from "react";
import { toast } from "sonner";

const PackageDisactiveDialog = ({
  id,
  isActive,
}: {
  id: string;
  isActive: boolean;
}) => {
  const [isPending, startTransition] = useTransition();

  const handleChangeStatus = () => {
    startTransition(async () => {
      const result = await updatePackageTemplateStatusAction(id, isActive);
      if (result.success) {
        toast.success(result.message, {
          richColors: true,
        });
      } else {
        toast.error(result.message, {
          richColors: true,
        });
      }
    });
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        {isActive ? (
          <Button variant="ghost" size="sm" className="text-red-600">
            <Trash className="h-4 w-4 mr-1" />
            Disactivate
          </Button>
        ) : (
          <Button variant="ghost" size="sm" className="text-green-600">
            <CircleCheck className="h-4 w-4 mr-1" />
            Activate
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to disactivate this package?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={() => handleChangeStatus()}
          >
            {isActive
              ? isPending
                ? "Changing status..."
                : "Disactivate"
              : isPending
                ? "Changing status..."
                : "Activate"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default PackageDisactiveDialog;
