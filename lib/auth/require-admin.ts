import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireAdminAuth() {
  const session = await auth();

  if (!session || session.user?.role !== "ADMIN") {
    redirect("/unauthorized");
  }

  return session;
}
