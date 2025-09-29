"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
} from "@/components/ui/sidebar";

import { AppSidebarLinks } from "./app-sidebar-links";
import { AppSidebarUser } from "./app-sidebar-user";

export function AppSidebar() {
  return (
    <Sidebar variant="sidebar" collapsible="icon">
      <SidebarContent>
        <AppSidebarLinks />
      </SidebarContent>
      <SidebarFooter>
        <AppSidebarUser />
      </SidebarFooter>
    </Sidebar>
  );
}
