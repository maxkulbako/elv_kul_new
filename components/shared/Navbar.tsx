import Link from "next/link";
import CallBackButton from "@/components/shared/CallBackButton";
import ClientMobileNavBar from "@/components/shared/ClientMobileNavbar";
import AdminNavBar from "./AdminNavBar";
import AdminMobileNavBar from "./AdminMobileNavbar";
import ClientNavBar from "./ClientNavBar";
import { auth } from "@/auth";

const Navbar = async () => {
  const session = await auth();
  console.log(session);

  if (!session || !session.user) {
    return (
      <Link href="/sign-in">
        <CallBackButton text="Клієнтський портал" />
      </Link>
    );
  }

  const userRole = session.user?.role;

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
