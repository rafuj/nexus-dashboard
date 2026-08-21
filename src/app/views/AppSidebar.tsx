"use client";

import * as React from "react";
import { Link } from "react-router";
// import updaidLogo from "@/assets/updaid-logo.png"
import updaidLogo from "@/assets/updaid-logo.svg"
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
import ImeiLinkingIcon from "@/assets/icons/imei-linking.svg?react"
import GenerateSerialNumberIcon from "@/assets/icons/generate-serial.svg?react"
import FactoryOverview from "@/assets/icons/factory-overview.svg?react"
import SupportIcon from "@/assets/icons/support.svg?react"
import FeedbackIcon from "@/assets/icons/feedback.svg?react"
import HowToUseIcon from "@/assets/icons/how-to-use.svg?react"
import DashboardIcon from "@/assets/icons/dashboard.svg?react"
import CabinetsIcon from "@/assets/icons/cabinets-icon.svg?react"
import ListIcon from "@/assets/icons/list.svg?react"
import MapIcon from "@/assets/icons/map-icon.svg?react"
import MonitorIcon from "@/assets/icons/monitor.svg?react"
import ActivityIcon from "@/assets/icons/activity.svg?react"
import SettingsIcon from "@/assets/icons/settings-icon.svg?react"
import { SupportModal } from "../components/support-modal";
import { FeedbackModal } from "../components/feedback-modal";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {

  const [supportModal, setSupportModal] = React.useState<boolean>(false)
  const [feedbackModal, setFeedbackModal] = React.useState<boolean>(false)
  
  const navMain = [
    {
      title: "Dashboard",
      url: "/",
      icon: <DashboardIcon />,
      isActive: false,
    },
    {
      title: "Cabinets",
      url: "/cabinets",
      icon: <CabinetsIcon />,
      isActive: false,
      items: [
        {
          title: "List",
          url: "/cabinets/list",
          icon: <ListIcon />,
        },
        {
          title: "Map",
          url: "/cabinets/map",
          icon: <MapIcon />,
        },
        {
          title: "Monitor",
          url: "/cabinets/monitor",
          icon: <MonitorIcon />,
        },
        {
          title: "Activity",
          url: "/cabinets/activity",
          icon: <ActivityIcon />,
        },
      ]
    },
    {
      title: "Settings",
      url: "/settings",
      icon: <SettingsIcon />,
      isActive: false,
    },
  ];
  
  const navMenuBottom = [
    {
      title: "Support",
      onClick: ()=> setSupportModal(true),
      icon: <SupportIcon />,
      isActive: false,
    },
    {
      title: "Feedback",
      onClick: ()=> setFeedbackModal(true),
      icon: <FeedbackIcon />,
      isActive: false,
    },
    {
      title: "How To Use",
      url: "/how-to-use",
      icon: <HowToUseIcon />,
      isActive: false,
    },
  ];
  
  const factoryNavMain = [
    {
      title: "IMEI Linking",
      url: "/",
      icon: <ImeiLinkingIcon />,
      isActive: false,
    },
    {
      title: "Generate Serial Number",
      url: "/generate-serial-number",
      icon: <GenerateSerialNumberIcon />,
      isActive: false,
    },
    {
      title: "Overview",
      url: "/factory-overview",
      icon: <FactoryOverview />,
      isActive: false,
    },
  ];
  
  const factoryNavMenuBottom = [
    {
      title: "Support",
      onClick: ()=> setSupportModal(true),
      icon: <SupportIcon />,
      isActive: false,
    },
  ];

  const { user } = useAuth();
  const sidebarUser = user
  ? { name: user.name, email: user.email }
  : { name: "", email: "" };
  

    const sidebarMainMenu = () => {
      switch(user?.role) {
        case "super":
          return factoryNavMain
        default :
          return navMain
      }
    }

    const sidebarBottomMenu = () => {
      switch(user?.role) {
        case "super":
          return factoryNavMenuBottom
        default :
          return navMenuBottom
      }
    }


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
      <SidebarContent className="pb-4 pt-5">
        <NavMain items={sidebarMainMenu()} />
        <div className="mt-auto pt-5"></div>
        <NavMain items={sidebarBottomMenu()} />

        <div className="mx-5 mt-3">
          <div className="border bg-[#F7F9FC] border-[#E4E8F1] rounded-[12px] py-2 px-3 flex items-center">
            <div className="w-0 grow">
              <span className="text-[10px] block text-foreground">Credits</span>
              <span className="font-semibold block text-[11px]">48 available</span>
            </div>
            <button type="button" className="text-[#C22722] transition-all border border-[#C22722] text-[10px] font-semibold rounded-[10px] px-3 h-7.5 duration-200 hover:bg-white">Buy credits</button>
          </div>
        </div>

        <SupportModal open={supportModal} setOpen={setSupportModal} />
        <FeedbackModal open={feedbackModal} setOpen={setFeedbackModal} />
      </SidebarContent>
      <div className="border-t mx-5"></div>
      <SidebarFooter>
        <NavUser user={sidebarUser} />
      </SidebarFooter>
    </Sidebar>
  );
}

