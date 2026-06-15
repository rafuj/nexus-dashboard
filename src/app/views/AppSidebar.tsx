"use client";

import * as React from "react";
import { Link } from "react-router";
import updaidLogo from "@/assets/updaid-logo.png"
import { useAuth } from "@/app/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarTrigger,
} from "@/shared/components/ui/sidebar";
import { NavMain } from "./NavMain";
import { NavUser } from "./NavUser";
import { SidebarIcons } from "../icons/sidebar-icons";

const navMain = [
  {
    title: "Dashboard",
    url: "/",
    icon: <SidebarIcons.dashboard />,
    isActive: false,
  },
  {
    title: "Cabinets",
    url: "/cabinets",
    icon: <SidebarIcons.cabinetsIcon />,
    isActive: false,
    items: [
      {
        title: "List",
        url: "/cabinets/list",
        icon: <SidebarIcons.list />,
      },
      {
        title: "Map",
        url: "/cabinets/map",
        icon: <SidebarIcons.map />,
      },
      {
        title: "Monitor",
        url: "/cabinets/monitor",
        icon: <SidebarIcons.monitor />,
      },
      {
        title: "Activity",
        url: "/cabinets/activity",
        icon: <SidebarIcons.activity />,
      },
    ]
  },
  {
    title: "Settings",
    url: "/settings",
    icon: <SidebarIcons.settingsIcon />,
    isActive: false,
  },
];

const navMenuBottom = [
  {
    title: "Support",
    url: "/support",
    icon: <SidebarIcons.supportIcon />,
    isActive: false,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: <SidebarIcons.feedbackIcon />,
    isActive: false,
  },
  {
    title: "How To Use",
    url: "/how-to-use",
    icon: <SidebarIcons.howToUseIcon />,
    isActive: false,
  },
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
          <div className="flex items-center justify-between gap-3">
            <Link to="/" className="w-0 grow block max-md:max-w-[180px]">
              <img src={updaidLogo} className="w-full" alt="updaid" />
            </Link>
            <SidebarTrigger />
          </div>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent className="pb-10 pt-5">
        <NavMain items={navMain} />
        <div className="mt-auto pt-5"></div>
        <NavMain items={navMenuBottom} />
      </SidebarContent>
      <div className="border-t mx-5"></div>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}

