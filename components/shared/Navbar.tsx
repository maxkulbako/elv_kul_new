import Link from "next/link";
import CallBackButton from "@/components/shared/CallBackButton";
import ClientMobileNavBar from "@/components/shared/ClientMobileNavbar";
import AdminNavBar from "./AdminNavBar";
import AdminMobileNavBar from "./AdminMobileNavbar";
import ClientNavBar from "./ClientNavBar";
import { auth } from "@/auth";

const Navbar = async () => {
  const session = await auth();

  if (!session) {
    return (
      <Link href="/sign-in">
        <CallBackButton text="Клієнтський портал"></CallBackButton>
      </Link>
    );
  }

  const userRole: "CLIENT" | "ADMIN" = session.user?.role;

  if (userRole === "ADMIN") {
    return (
      <>
        <AdminNavBar session={session} />
        <AdminMobileNavBar session={session} />
      </>
    );
  }

  return (
    <>
      <ClientNavBar session={session} />
      <ClientMobileNavBar session={session} />
    </>
  );
};

export default Navbar;
