import { Navigate, Outlet } from "react-router";
import { AppSidebar } from "../views/AppSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { useAuth } from "../hooks/useAuth";
import Notifications from "../components/notifications";
import { Button } from "@/shared/components/ui/button";
import { ShoppingCart } from "lucide-react";

function CollapsedSidebarTrigger() {
  const { isMobile, state } = useSidebar();

  if (!isMobile && state !== "collapsed") {
    return <></>
  }

  return (
    <SidebarTrigger className="rotate-180" />
  );
}

export default function PageLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0">
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
