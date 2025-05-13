import { z } from "zod";
import {
  signUpFormSchema,
  createPackageFormSchema,
  updateAppointmentStatusFormSchema,
} from "@/lib/validations";

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type CreatePackageFormValues = z.infer<typeof createPackageFormSchema>;
export type UpdateAppointmentStatusFormValues = z.infer<
  typeof updateAppointmentStatusFormSchema
>;
