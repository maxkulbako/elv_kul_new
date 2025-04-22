import { z } from "zod";
import { signUpFormSchema, createPackageFormSchema } from "@/lib/validations";

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
export type CreatePackageFormValues = z.infer<typeof createPackageFormSchema>;
