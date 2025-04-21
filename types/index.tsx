import { z } from "zod";
import { signUpFormSchema } from "@/lib/validations";

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
