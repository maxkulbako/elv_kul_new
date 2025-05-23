import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "./dashboard/AppSideBar";
import { auth } from "@/auth";

export default async function ClientPortalLayout({
  children,
  modal,
}: {
  children: React.ReactNode;
  modal: React.ReactNode;
}) {
  const session = await auth();

  return (
    <SidebarProvider>
      <AppSideBar user={session?.user} />
      <div className="flex flex-col bg-olive-light w-full">{children}</div>
      {modal}
    </SidebarProvider>
  );
}
