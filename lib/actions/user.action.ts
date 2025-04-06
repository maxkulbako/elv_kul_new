"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema } from "../validations";
import { isRedirectError } from "next/dist/client/components/redirect-error";

// sign in user with credentials
export const signInWithCredentials = async (
  prevState: unknown,
  formData: FormData
) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);

    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }

    return { success: false, message: "Invalid email or password" };
  }
};

// sign out user
export const signOutUser = async () => {
  try {
    await signOut();
    return { success: true, message: "Signed out successfully" };
  } catch (error) {
    return { success: false, message: "Failed to sign out" };
  }
};
