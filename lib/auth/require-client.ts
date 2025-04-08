import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function requireClientAuth() {
  const session = await auth();
  console.log(session);
  if (!session || session.user?.role !== "CLIENT") {
    redirect("/");
  }

  return session;
}
