"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { createPackageFormSchema } from "@/lib/validations";
import { CreatePackageFormValues } from "@/types";
import { useTransition } from "react";
import { createPackageTemplateAction } from "@/lib/actions/price.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
const CreatePackageDialog = () => {
  const [isAddingPackage, setIsAddingPackage] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePackageFormValues>({
    resolver: zodResolver(createPackageFormSchema),
    defaultValues: {
      name: "",
      description: "",
      sessionsTotal: 0,
      price: 0,
      validDays: 0,
      validFrom: new Date(),
    },
  });

  const handleAddPackage = async (data: CreatePackageFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("description", data.description);
    formData.append("sessionsTotal", data.sessionsTotal.toString());
    formData.append("price", data.price.toString());
    formData.append("validDays", data.validDays.toString());
    formData.append("validFrom", data.validFrom.toISOString());

    startTransition(async () => {
      const result = await createPackageTemplateAction(formData);
      if (result?.success) {
        setIsAddingPackage(false);
        toast.success(result.message, {
          richColors: true,
        });
        reset();
        router.refresh();
      } else {
        toast.error(result.message, {
          richColors: true,
        });
      }
    });
  };

  return (
    <Dialog open={isAddingPackage} onOpenChange={setIsAddingPackage}>
      <DialogTrigger asChild>
        <Button className="bg-olive-primary hover:bg-olive-primary/90 text-white text-md font-semibold">
          <Plus className="h-4 w-4" />
          Create New Package
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <form onSubmit={handleSubmit(handleAddPackage)}>
          <DialogHeader>
            <DialogTitle>Create New Service Package</DialogTitle>
            <DialogDescription>
              Set up a new package with special pricing for your therapy
              services.
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="name" className="text-sm font-medium">
                Package Name
              </label>
              <Input
                id="name"
                {...register("name")}
                placeholder="e.g., Premium Therapy Package"
                className={errors.name && "border-red-500"}
              />
              {errors.name && (
                <span className="text-red-500 text-sm">
                  {errors.name?.message}
                </span>
              )}
            </div>

            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <Textarea
                id="description"
                {...register("description")}
                placeholder="Describe what's included in this package..."
                className={errors.description && "border-red-500"}
              />
              {errors.description && (
                <span className="text-red-500 text-sm">
                  {errors.description?.message}
                </span>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="sessionsTotal" className="text-sm font-medium">
                  Number of Sessions
                </label>
                <Input
                  id="sessionsTotal"
                  {...register("sessionsTotal", { valueAsNumber: true })}
                  type="number"
                  className={errors.sessionsTotal && "border-red-500"}
                />
                {errors.sessionsTotal && (
                  <span className="text-red-500 text-sm">
                    {errors.sessionsTotal?.message}
                  </span>
                )}
              </div>
              <div className="grid gap-2">
                <label htmlFor="validDays" className="text-sm font-medium">
                  Validity Period
                </label>
                <Input
                  id="validDays"
                  {...register("validDays", { valueAsNumber: true })}
                  placeholder="e.g., 60 days"
                  className={errors.validDays && "border-red-500"}
                />
                {errors.validDays && (
                  <span className="text-red-500 text-sm">
                    {errors.validDays?.message}
                  </span>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <label htmlFor="price" className="text-sm font-medium">
                  Package Total Price ($)
                </label>
                <Input
                  id="price"
                  {...register("price", { valueAsNumber: true })}
                  type="number"
                  min={0}
                  className={errors.price && "border-red-500"}
                />
                {errors.price && (
                  <span className="text-red-500 text-sm">
                    {errors.price?.message}
                  </span>
                )}
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddingPackage(false)}>
              Cancel
            </Button>
            <Button
              className="bg-olive-primary hover:bg-olive-primary/90"
              type="submit"
              disabled={isPending}
            >
              {isPending ? "Creating..." : "Create Package"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePackageDialog;
