"use server";

import { signIn, signOut } from "@/auth";
import { signInFormSchema, signUpFormSchema } from "../validations";
import { isRedirectError } from "next/dist/client/components/redirect-error";
import { hashSync } from "bcrypt-ts-edge";
import { prisma } from "../prisma";

// sign in user with credentials
export const signInWithCredentials = async (
  _prevState: unknown,
  formData: FormData
) => {
  try {
    const user = signInFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    await signIn("credentials", user);
    console.log("Signed in successfully");
    return { success: true, message: "Signed in successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    console.log(error);
    return { success: false, message: "Invalid email or password" };
  }
};

// sign out user
export const signOutUser = async () => {
  await signOut({ redirectTo: "/" });
};

// sign up user
export const signUpWithCredentialsAction = async (
  _prevState: unknown,
  formData: FormData
) => {
  try {
    const user = signUpFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      confirmPassword: formData.get("confirmPassword"),
      name: formData.get("name"),
      birthDate: formData.get("birthDate"),
      phone: formData.get("phone"),
      telegram: formData.get("telegram"),
      profession: formData.get("profession"),
    });

    const plainPassword = user.password;

    user.password = hashSync(user.password, 10);

    await prisma.user.create({
      data: {
        email: user.email,
        password: user.password,
        name: user.name,
        birthDate: user.birthDate,
        phone: user.phone,
        telegram: user.telegram,
        profession: user.profession,
      },
    });

    await signIn("credentials", {
      email: user.email,
      password: plainPassword,
    });

    return { success: true, message: "User registered successfully" };
  } catch (error) {
    if (isRedirectError(error)) {
      throw error;
    }
    // TODO: add error handling for zod validation errors
    return { success: false, message: "User registration failed" };
  }
};
