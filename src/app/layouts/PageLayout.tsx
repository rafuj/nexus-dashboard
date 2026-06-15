import { Navigate, Outlet } from "react-router";
import { AppSidebar } from "../views/AppSidebar";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from "@/shared/components/ui/sidebar";
import { useAuth } from "../hooks/useAuth";

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
