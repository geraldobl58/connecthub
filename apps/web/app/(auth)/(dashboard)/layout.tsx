import { cookies } from "next/headers";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedLayout } from "@/components/protected-layout";
import { SidebarProvider } from "@/components/ui/sidebar";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClientProvider } from "@/providers/query-provider";
import { Toaster } from "sonner";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ProtectedLayout>
      <QueryClientProvider client={queryClientProvider}>
        <SidebarProvider defaultOpen={defaultOpen}>
          <AppSidebar />
          <Toaster />
          <div className="flex-1 min-h-screen">
            <main>{children}</main>
          </div>
        </SidebarProvider>
        <ReactQueryDevtools />
      </QueryClientProvider>
    </ProtectedLayout>
  );
}
