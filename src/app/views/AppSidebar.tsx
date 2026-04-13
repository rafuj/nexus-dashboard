"use client";

import * as React from "react";
import { Boxes, Box, ScanHeart } from "lucide-react";
import { Link } from "react-router";

import { useAuth } from "@/app/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/shared/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";

const navMain =[

  {
      title: "Dashboard",
      url: "/",
      icon: Boxes,
      isActive: true,
  },
  {
      title: "Cabinets",
      url: "/cabinets",
      icon: ScanHeart,
      isActive: false,
  }
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  const sidebarUser = user
    ? { name: user.name, email: user.email } 
    : { name: "", email: "" }; 

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <span>U</span>
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">UPDAID</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
