"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { createPackageFormSchema } from "@/lib/validations";
import { CreatePackageFormValues } from "@/types";
import { useTransition } from "react";
import {
  createPackageTemplateAction,
  updatePackageTemplateAction,
} from "@/lib/actions/price.action";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

interface PackageFormProps {
  initialData?: CreatePackageFormValues & { id: string };
}

const PackageForm = ({ initialData }: PackageFormProps) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreatePackageFormValues>({
    resolver: zodResolver(createPackageFormSchema),
    defaultValues: initialData,
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
      let result;

      if (initialData?.id) {
        result = await updatePackageTemplateAction(initialData.id, formData);
      } else {
        result = await createPackageTemplateAction(formData);
      }
      if (result?.success) {
        toast.success(result.message, {
          richColors: true,
        });
        reset();
        router.back();
      } else {
        toast.error(result.message, {
          richColors: true,
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(handleAddPackage)}>
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
            <span className="text-red-500 text-sm">{errors.name?.message}</span>
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
          <div className="grid gap-2">
            <label htmlFor="validFrom" className="text-sm font-medium">
              Start date
            </label>
            <Input
              id="validFrom"
              type="date"
              {...register("validFrom", { valueAsDate: true })}
              className={errors.validFrom && "border-red-500"}
            />
            {errors.validFrom && (
              <span className="text-red-500 text-sm">
                {errors.validFrom.message}
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
        <Button
          className="bg-olive-primary hover:bg-olive-primary/90 w-fit"
          type="submit"
          disabled={isPending}
        >
          {initialData
            ? isPending
              ? "Updating..."
              : "Update Package"
            : isPending
              ? "Creating..."
              : "Create Package"}
        </Button>
        <button type="submit">Test</button>
      </div>
    </form>
  );
};

export default PackageForm;
