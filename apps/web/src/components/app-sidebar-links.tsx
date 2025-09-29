"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { ChevronDown } from "lucide-react";

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Logo } from "./logo";
import { mainItems } from "./app-sidebar-nav-links";
import { usePermissions } from "@/hooks/use-permissions";
import { NavItem } from "@/types/permissions";

export const AppSidebarLinks = () => {
  const pathname = usePathname();
  const { hasPermission } = usePermissions();

  const isActive = (url: string): boolean => {
    // Ignora URLs que são apenas "#" (placeholders)
    if (url === "#" || !url) return false;

    // Remove trailing slash se existir
    const normalizedUrl =
      url.endsWith("/") && url !== "/" ? url.slice(0, -1) : url;
    const normalizedPathname =
      pathname.endsWith("/") && pathname !== "/"
        ? pathname.slice(0, -1)
        : pathname;

    // Casos especiais para rotas raiz
    if (normalizedUrl === "/" || normalizedUrl === "/dashboard") {
      return (
        normalizedPathname === "/" ||
        normalizedPathname === "/dashboard" ||
        pathname.startsWith("/dashboard/")
      );
    }

    // Para outras rotas, verifica correspondência exata ou sub-caminhos
    if (normalizedPathname === normalizedUrl) return true;

    // Verifica se é um sub-caminho válido (deve ter "/" após o URL base)
    return (
      pathname.startsWith(normalizedUrl + "/") ||
      pathname.startsWith(normalizedUrl + "?")
    );
  };

  const hasActiveSubitem = (subitems?: NavItem["subitems"]): boolean => {
    if (!subitems) return false;
    return subitems.some((subitem) => {
      // Verifica se algum subitem está ativo
      return isActive(subitem.url);
    });
  };

  // Função para verificar se o usuário tem permissão para um item
  const hasItemPermission = (item: NavItem): boolean => {
    // Se não há permissão definida, o item é acessível para todos
    if (!item.permission) return true;

    return hasPermission(item.permission.resource, item.permission.action);
  };

  // Função para verificar se o usuário tem permissão para um subitem
  const hasSubitemPermission = (
    subitem: NonNullable<NavItem["subitems"]>[0]
  ): boolean => {
    // Se não há permissão definida, o subitem é acessível para todos
    if (!subitem.permission) return true;

    return hasPermission(
      subitem.permission.resource,
      subitem.permission.action
    );
  };

  // Função para filtrar itens baseado nas permissões
  const filterItemsByPermissions = (items: NavItem[]): NavItem[] => {
    return items
      .filter(hasItemPermission)
      .map((item) => {
        // Se o item tem subitems, filtra os subitems também
        if (item.subitems) {
          const filteredSubitems = item.subitems.filter(hasSubitemPermission);

          // Se não há subitems visíveis, não mostra o item principal
          if (filteredSubitems.length === 0) {
            return null;
          }

          return {
            ...item,
            subitems: filteredSubitems,
          };
        }

        return item;
      })
      .filter((item): item is NavItem => item !== null);
  };

  const getNavItemClasses = (item: NavItem) => {
    // Verifica se o item atual está ativo ou se algum subitem está ativo
    const isItemActive = isActive(item.url);
    const hasActiveChild = hasActiveSubitem(item.subitems);
    const active = isItemActive || hasActiveChild;

    return {
      linkClasses: [
        "flex items-center gap-2 transition-colors duration-200 rounded-md px-2 py-1.5",
        active
          ? "text-primary bg-primary/10 font-semibold"
          : "text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium",
      ].join(" "),
      iconClasses: "size-4",
      textClasses: active ? "font-semibold" : "font-medium",
    };
  };

  const renderNavItem = (item: NavItem) => {
    const { linkClasses, iconClasses, textClasses } = getNavItemClasses(item);

    // Se tem subitems, renderizar com Collapsible
    if (item.subitems && item.subitems.length > 0) {
      const hasActiveChild = hasActiveSubitem(item.subitems);
      return (
        <Collapsible defaultOpen={hasActiveChild} className="group/collapsible">
          <CollapsibleTrigger asChild className="cursor-pointer">
            <SidebarMenuButton className={linkClasses}>
              <item.icon className={iconClasses} />
              <span className={textClasses}>{item.title}</span>
              <ChevronDown className="ml-auto cursor-pointer transition-transform group-data-[state=open]/collapsible:rotate-180 size-4" />
            </SidebarMenuButton>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <SidebarMenuSub>
              {item.subitems.map((subitem) => {
                const isSubitemActive = isActive(subitem.url);
                return (
                  <SidebarMenuSubItem key={subitem.title}>
                    <SidebarMenuButton asChild>
                      <Link
                        href={subitem.url}
                        className={[
                          "flex items-center gap-2 transition-colors duration-200 rounded-md px-2 py-1.5",
                          isSubitemActive
                            ? "text-primary bg-primary/10 font-semibold"
                            : "text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium",
                        ].join(" ")}
                      >
                        <subitem.icon className="size-4" />
                        <span
                          className={
                            isSubitemActive ? "font-semibold" : "font-medium"
                          }
                        >
                          {subitem.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </Collapsible>
      );
    }

    // Renderização padrão para itens sem subitems
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
    <>
      {/* Logo Section */}
      <div className="flex items-center border-b p-2">
        <Logo />
      </div>

      {/* Projetos Section */}
      <SidebarGroup>
        <SidebarGroupLabel>Administração</SidebarGroupLabel>
        <SidebarGroupContent>
          <SidebarMenu>
            {filterItemsByPermissions(mainItems).map((item) => (
              <SidebarMenuItem key={item.title} className="mb-2">
                {renderNavItem(item)}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroupContent>
      </SidebarGroup>
    </>
  );
};
