import { Navigate, Outlet } from "react-router";
import { AppSidebar } from "../views/AppSidebar"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"
import { useAuth } from "../hooks/useAuth";



export default function PageLayout() {
  const { user } = useAuth(); // Get the user from the context
  if (!user) { // If the user is not authenticated, redirect to the login page
    return <Navigate to="/login" /> // Redirect to the login page
  }

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
          </div>
        </header>
          <main>
            <Outlet />
          </main>
        </SidebarInset>
    </SidebarProvider>
  );
}