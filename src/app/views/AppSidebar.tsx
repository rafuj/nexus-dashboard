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

const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: Boxes,
    isActive: true,
  },
  {
    title: "Cabinets",
    url: "/cabinetview",
    icon: ScanHeart,
    isActive: false,
    permissions: ["manage_cabinets"], // Permissions for the item
    items: [
      {
        title: "Cabinets",
        url: "/cabinets",
        permissions: ["manage_cabinets"], // Permissions for the sub item
      },
    ],
  },
  {
    title: "Assets",
    url: "/assets",
    icon: Box,
    isActive: false,
    permissions: ["manage_assets"], // Permissions for the item
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user } = useAuth();
  // Get the user from the context
  const sidebarUser = user
    ? { name: user.name, email: user.email } // Get the name and email of the user
    : { name: "", email: "" }; // Default to empty name and email if no user is authenticated

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
