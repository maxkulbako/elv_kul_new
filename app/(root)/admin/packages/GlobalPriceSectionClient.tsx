"use client";

import { useState, useTransition } from "react";
import { updateGlobalPrice } from "@/lib/actions/price.action";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";

interface Props {
  initialPrice: number;
}

export default function GlobalPriceSectionClient({ initialPrice }: Props) {
  const [editing, setEditing] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleSubmit = async (formData: FormData) => {
    startTransition(async () => {
      try {
        const result = await updateGlobalPrice(formData);
        if (result.success) {
          toast.success(result.message, {
            richColors: true,
          });
          setEditing(false);
          router.refresh();
        } else {
          toast.error(result.message, {
            richColors: true,
          });
        }
      } catch (error) {
        console.error("Failed to update price:", error);
        toast.error("Failed to update price", {
          richColors: true,
        });
      }
    });
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>Global Session Price</CardTitle>
        <CardDescription>
          Set the default session price for all clients
        </CardDescription>
      </CardHeader>
      <CardContent>
        {editing ? (
          <form action={handleSubmit}>
            <div className="flex items-center space-x-4">
              <Input
                name="singlePrice"
                type="number"
                min="0"
                defaultValue={initialPrice}
                className="w-32"
              />
              <Button
                type="submit"
                className="bg-olive-primary hover:bg-olive-primary/90"
                disabled={isPending}
              >
                {isPending ? "Saving…" : "Save"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setEditing(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="flex items-center space-x-4">
            <span className="text-2xl font-semibold">
              ${initialPrice.toLocaleString()}
            </span>
            <Button
              variant="outline"
              onClick={() => setEditing(true)}
              disabled={isPending}
            >
              Edit Price
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
