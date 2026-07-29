// src/layouts/CustomerLayout.tsx

import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/layout/Sidebar";
import Navbar from "@/components/layout/Navbar";

import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function CustomerLayout() {
  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset>
        <Navbar />

        <main className="flex-1 bg-background p-6">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
