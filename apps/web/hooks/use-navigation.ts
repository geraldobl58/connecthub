import { usePathname } from "next/navigation";

interface NavItem {
  title: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  active?: boolean;
  matchPattern?: string; // Para patterns mais complexos de matching
}

export const useNavigation = () => {
  const pathname = usePathname();

  const isActive = (url: string, matchPattern?: string): boolean => {
    if (matchPattern) {
      // Use regex pattern for complex matching
      const regex = new RegExp(matchPattern);
      return regex.test(pathname);
    }

    // Exact match for root routes
    if (url === "/dashboard" || url === "/analytics") {
      return pathname === url;
    }

    // Prefix match for sections with subroutes
    return pathname.startsWith(url);
  };

  const getNavItemClasses = (item: NavItem) => {
    const active = isActive(item.url, item.matchPattern);

    return {
      linkClasses: [
        "flex items-center gap-2 transition-colors duration-200 rounded-md px-2 py-1.5",
        active
          ? "text-primary bg-primary/10 font-semibold"
          : "text-muted-foreground hover:text-primary hover:bg-primary/5 font-medium",
      ].join(" "),
      iconClasses: "size-4",
      textClasses: active ? "font-semibold" : "font-medium",
      isActive: active,
    };
  };

  return {
    pathname,
    isActive,
    getNavItemClasses,
  };
};
