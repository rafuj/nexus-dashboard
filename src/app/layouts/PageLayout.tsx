import { Navigate, Outlet, useLocation } from "react-router";
import { AppSidebar } from "../views/AppSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { useAuth } from "../hooks/useAuth";
import { useEffect } from "react";

export function CollapsedSidebarTrigger() {
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

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
