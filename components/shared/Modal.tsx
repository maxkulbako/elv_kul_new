"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";

const Modal = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleOpenChange = () => {
    router.back();
  };

  return (
    <Dialog defaultOpen={true} open={true} onOpenChange={handleOpenChange}>
      <DialogHeader className="hidden">
        <DialogTitle>Create New Service Package</DialogTitle>
        <DialogDescription>
          Set up a new package with special pricing for your therapy services.
        </DialogDescription>
      </DialogHeader>

      <DialogContent>{children}</DialogContent>
    </Dialog>
  );
};

export default Modal;
