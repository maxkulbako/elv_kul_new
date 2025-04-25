"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff } from "lucide-react";
import { useState, useTransition } from "react";
import { signUpWithCredentialsAction } from "@/lib/actions/user.action";
import { signUpFormSchema } from "@/lib/validations";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignUpFormValues } from "@/types";
import { toast } from "sonner";

const CredentialsSignUpForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      birthDate: new Date(),
      phone: "",
      telegram: "",
      profession: "",
    },
  });

  const onSubmit = (data: SignUpFormValues) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("password", data.password);
    formData.append("confirmPassword", data.confirmPassword);
    formData.append("birthDate", data.birthDate.toISOString());
    formData.append("phone", data.phone);
    formData.append("telegram", data.telegram);
    formData.append("profession", data.profession);

    startTransition(async () => {
      const result = await signUpWithCredentialsAction(null, formData);
      if (result?.success) {
        reset();
      } else {
        toast.error(result.message, {
          richColors: true,
        });
      }
    });
  };

  return (
    <form className="space-y-4 mt-4" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <Label htmlFor="name">Ім&apos;я</Label>
        <Input
          id="name"
          type="text"
          placeholder="Ім'я"
          autoComplete="name"
          {...register("name")}
          className={errors.name && "border-red-500"}
        />
        {errors.name && (
          <span className="text-red-500 text-sm">{errors.name?.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="text"
          placeholder="name@example.com"
          autoComplete="email"
          {...register("email")}
          className={errors.email && "border-red-500"}
        />
        {errors.email && (
          <span className="text-red-500 text-sm">{errors.email?.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="new-password"
            {...register("password")}
          />
          <button
            type="button"
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        </div>
        {errors.password && (
          <span className="text-red-500 text-sm">
            {errors.password?.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm Password</Label>
        <div className="relative">
          <Input
            id="confirmPassword"
            type={showPassword ? "text" : "password"}
            placeholder="••••••••"
            autoComplete="confirmPassword"
            {...register("confirmPassword")}
            className={errors.confirmPassword && "border-red-500"}
          />
        </div>
        {errors.confirmPassword && (
          <span className="text-red-500 text-sm">
            {errors.confirmPassword?.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="birthDate">Дата народження</Label>
        <Input
          id="birthDate"
          type="date"
          autoComplete="bday"
          {...register("birthDate")}
          className={errors.birthDate && "border-red-500"}
        />
        {errors.birthDate && (
          <span className="text-red-500 text-sm">
            {errors.birthDate?.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Телефон</Label>
        <Input
          id="phone"
          type="text"
          placeholder="Телефон"
          autoComplete="+380 XX XXX XX XX"
          {...register("phone")}
          className={errors.phone && "border-red-500"}
        />
        {errors.phone && (
          <span className="text-red-500 text-sm">{errors.phone?.message}</span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="telegram">Telegram</Label>
        <Input
          id="telegram"
          type="text"
          placeholder="Telegram"
          autoComplete="off"
          {...register("telegram")}
          className={errors.telegram && "border-red-500"}
        />
        {errors.telegram && (
          <span className="text-red-500 text-sm">
            {errors.telegram?.message}
          </span>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="profession">Професія</Label>
        <Input
          id="profession"
          type="text"
          placeholder="Професія"
          autoComplete="organization-title"
          {...register("profession")}
          className={errors.profession && "border-red-500"}
        />
        {errors.profession && (
          <span className="text-red-500 text-sm">
            {errors.profession?.message}
          </span>
        )}
      </div>

      <Button
        type="submit"
        className="w-full !bg-olive-primary hover:opacity-90 !text-bold"
        disabled={isPending}
      >
        {isPending ? "Вхід..." : "Вхід"}
      </Button>
    </form>
  );
};

export default CredentialsSignUpForm;
