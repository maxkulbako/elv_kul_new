"use client";

import { ScrollArea } from "@radix-ui/react-scroll-area";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { Button } from "../ui/button";

const SlideOver = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const handleClose = () => {
    router.back();
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50"
        role="button"
        aria-label="Close"
        onClick={handleClose}
      />
      {/* Panel */}
      <div className="relative h-full w-full max-w-md bg-white shadow-xl flex flex-col p-4">
        <div className="flex justify-end">
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X />
          </Button>
        </div>
        <ScrollArea className="flex-1">{children}</ScrollArea>
      </div>
    </div>
  );
};

export default SlideOver;
