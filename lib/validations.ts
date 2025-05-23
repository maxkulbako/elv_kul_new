import { z } from "zod";

// Schema for sign users in
export const signInFormSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

// Schema for sign users up
export const signUpFormSchema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters long"),
    email: z.string().email("Invalid email address"),
    birthDate: z.coerce.date().refine((date) => {
      const today = new Date();
      const age = today.getFullYear() - date.getFullYear();
      return age >= 18;
    }, "You must be at least 18 years old"),
    phone: z
      .string()
      .min(10, "Phone number must be at least 10 characters long"),
    telegram: z.string().min(3, "Telegram must be at least 3 characters long"),
    profession: z.string(),
    password: z.string().min(6, "Password must be at least 6 characters long"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// Schema for create package
export const createPackageFormSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  description: z
    .string()
    .min(3, "Description must be at least 3 characters long"),
  sessionsTotal: z.number().min(1, "Sessions total must be at least 1"),
  price: z.number().min(0, "Price must be at least 0"),
  validDays: z.number().min(1, "Valid days must be at least 1"),
  validFrom: z.coerce.date(),
});

// Schema for update Appointment status
export const updateAppointmentStatusFormSchema = z.object({
  status: z.string().min(1, "Status is required"),
});
