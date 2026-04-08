"use client"

import * as React from "react"
import {
    ScanHeart
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
  SidebarTrigger
} from "@/shared/components/ui/sidebar"
import { NavMain } from "./NavMain"
import { NavUser } from "./NavUser"


const data = {
    user : {
        name: "Marcel Mattijssen",
        email: "mhbmattijssen@gmail.com",
        avatar: "d"
    },
    navMain: [
        {
            title: "Cabinets",
            url: "#",
            icon: ScanHeart,
            isActive: false,
            items: [
                {
                    title: "Overview",
                    url: "#"
                }
            ]
        }
    ]
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar variant="inset" {...props}>
        <SidebarHeader>
            <SidebarMenu>
                <SidebarMenuItem>
                    <SidebarMenuButton size="lg" asChild>
                        <a href="#">
                            <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                                <span>U</span>
                            </div>
                            <div className="grid flex-1 text-left text-sm leading-tight">
                            <span className="truncate font-medium">UPDAID</span>
                            </div>
                        </a>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarHeader>
        <SidebarContent>
            <NavMain items={data.navMain} />
        </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>

  )
}