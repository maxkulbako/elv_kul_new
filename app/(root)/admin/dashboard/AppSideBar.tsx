import { Calendar, CreditCard, FileText, Settings, Users } from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { auth } from "@/auth";
import Link from "next/link";
import CustomSideBarMenuButton from "./CustomSideBarMenuButton";

const AppSideBar = async () => {
  const session = await auth();
  const user = session?.user;

  return (
    <Sidebar
      className="border-r border-olive-primary/20 h-auto hidden lg:block"
      collapsible="none"
    >
      <SidebarHeader className="border-b border-olive-primary/20 py-4">
        <div className="flex items-center px-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-olive-primary text-white mr-3">
            {user?.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h3 className="font-medium">Dr. {user?.name}</h3>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/admin/dashboard">
                  <CustomSideBarMenuButton
                    tooltip="Dashboard"
                    href="/admin/dashboard"
                  >
                    <FileText className="h-4 w-4" />
                    <span>Dashboard</span>
                  </CustomSideBarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/clients">
                  <CustomSideBarMenuButton
                    tooltip="Clients"
                    href="/admin/clients"
                  >
                    <Users className="h-4 w-4" />
                    <span>Clients</span>
                  </CustomSideBarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/calendar">
                  <CustomSideBarMenuButton
                    tooltip="Calendar"
                    href="/admin/calendar"
                  >
                    <Calendar className="h-4 w-4" />
                    <span>Calendar</span>
                  </CustomSideBarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel>Business</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <Link href="/admin/packages">
                  <CustomSideBarMenuButton
                    tooltip="Service Packages"
                    href="/admin/packages"
                  >
                    <CreditCard className="h-4 w-4" />
                    <span>Service Packages</span>
                  </CustomSideBarMenuButton>
                </Link>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <Link href="/admin/settings">
                  <CustomSideBarMenuButton
                    tooltip="Settings"
                    href="/admin/settings"
                  >
                    <Settings className="h-4 w-4" />
                    <span>Settings</span>
                  </CustomSideBarMenuButton>
                </Link>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSideBar;
