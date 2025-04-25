"use client";

import { SidebarMenuButton } from "@/components/ui/sidebar";
import { usePathname } from "next/navigation";
const CustomSideBarMenuButton = ({
  tooltip,
  href,
  children,
}: {
  tooltip: string;
  href: string;
  children: React.ReactNode;
}) => {
  const pathname = usePathname();
  const isActive = pathname === href;
  return (
    <SidebarMenuButton tooltip={tooltip} isActive={isActive}>
      {children}
    </SidebarMenuButton>
  );
};

export default CustomSideBarMenuButton;
