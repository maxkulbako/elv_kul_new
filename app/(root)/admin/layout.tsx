import { SidebarProvider } from "@/components/ui/sidebar";
import AppSideBar from "./dashboard/AppSideBar";

export default function ClientPortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <AppSideBar />
      <div className="flex flex-col bg-olive-light w-full">{children}</div>
    </SidebarProvider>
  );
}
