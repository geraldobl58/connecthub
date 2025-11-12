"use client";

import Link from "next/link";
import Image from "next/image";

import {
  ChartBar,
  NotebookTabs,
  PieChart,
  Settings,
  ShieldUser,
  Users,
} from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

import { useNavigation } from "@/hooks/use-navigation";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  items?: React.ReactNode;
}

export const SidebarLinks = () => {
  const { getNavItemClasses } = useNavigation();

  const mainItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: PieChart,
    },
    {
      title: "Métricas",
      url: "/dashboard/analytics",
      icon: ChartBar,
    },
    {
      title: "Contratos",
      url: "/dashboard/contracts",
      icon: NotebookTabs,
    },
    {
      title: "Clientes",
      url: "/dashboard/clients",
      icon: ShieldUser,
    },
  ];

  const settingItems: NavItem[] = [
    {
      title: "Configurações",
      url: "/settings/system",
      icon: Settings,
    },
    {
      title: "Usuários",
      url: "/settings/users",
      icon: Users,
    },
  ];

  const renderNavItem = (item: NavItem) => {
    const { linkClasses, iconClasses, textClasses } = getNavItemClasses(item);

    return (
      <SidebarMenuButton key={item.title} asChild>
        <Link href={item.url} className={linkClasses}>
          <item.icon className={iconClasses} />
          <span className={textClasses}>{item.title}</span>
          {item.items && item.items}
        </Link>
      </SidebarMenuButton>
    );
  };

  return (
    <SidebarGroup className="p-0">
      <div className="flex items-center justify-between shadow-md p-4 mb-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Image
            src="/assets/images/logo.svg"
            width={48}
            height={48}
            alt="ConnectHub"
            className="w-12 h-12"
          />
        </Link>
      </div>
      <SidebarGroupContent className="p-2">
        <SidebarGroupLabel>Dashboard</SidebarGroupLabel>
        <SidebarMenu>
          {/* Main Navigation Items */}
          {mainItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {renderNavItem(item)}
            </SidebarMenuItem>
          ))}

          <SidebarGroupLabel>Sistema</SidebarGroupLabel>
          {settingItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              {renderNavItem(item)}
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
};
