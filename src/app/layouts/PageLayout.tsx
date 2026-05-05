import { Navigate, Outlet } from "react-router";
import { AppSidebar } from "../views/AppSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { useAuth } from "../hooks/useAuth";
import Notifications from "../components/notifications";
import { Button } from "@/shared/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function PageLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="shrink-0 items-center gap-2 bg-sidebar sticky top-0 z-20 pt-2">
          <div className="flex justify-between items-center bg-white rounded-lg shadow-sm px-2.5 py-2.5">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="default">
                <ShoppingCart /> Buy License
              </Button>
              <Notifications />
            </div>
          </div>
        </header>
        <main className="px-4 py-5">
          <Outlet />
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
