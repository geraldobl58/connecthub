import { cookies } from "next/headers";

import { AppSidebar } from "@/components/app-sidebar";
import { ProtectedLayout } from "@/components/protected-layout";
import { SidebarProvider } from "@/components/ui/sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const defaultOpen = cookieStore.get("sidebar_state")?.value === "true";

  return (
    <ProtectedLayout>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <div className="flex-1 min-h-screen">
          <main>{children}</main>
        </div>
      </SidebarProvider>
    </ProtectedLayout>
  );
}
