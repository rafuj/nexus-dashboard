import { Outlet } from "react-router";
import { AppSidebar } from "../views/AppSidebar"

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar"



export default function PageLayout() {

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