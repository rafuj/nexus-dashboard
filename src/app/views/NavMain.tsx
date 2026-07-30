"use client";

import { ChevronRight } from "lucide-react";

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";

import {
  SidebarGroup,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/shared/components/ui/sidebar";
import { can, type Role } from "@/lib/permissions";
import { useAuth } from "../hooks/useAuth";
import { Link, useLocation } from "react-router";
import React, { type ReactNode } from "react";
import { cn } from "@/lib/utils";

type NavSubItem = {
  title: string;
  url: string;
  permissions?: string[];
};

type NavItem = {
  title: string;
  url?: string;
  onClick?: () => void;
  icon: React.ReactNode;
  isActive?: boolean;
  permissions?: string[];
  items?: NavSubItem[];
};

const normalizePath = (path: string) => {
  const normalizedPath = path.replace(/\/+$/, "");
  return normalizedPath === "" ? "/" : normalizedPath;
};

const isPathActive = (pathname: string, targetPath: string) => {
  const currentPath = normalizePath(pathname);
  const normalizedTargetPath = normalizePath(targetPath);

  if (normalizedTargetPath === "/") {
    return currentPath === "/";
  }

  return (
    currentPath === normalizedTargetPath ||
    currentPath.startsWith(`${normalizedTargetPath}/`)
  );
};

function NavMainItem({
  item,
  role,
  pathname,
}: {
  item: NavItem;
  role: Role;
  pathname: string;
  icon?: ReactNode,
}) {
  const visibleSubItems =
    item.items?.filter(
      (sub) => !sub.permissions?.length || sub.permissions.some((p) => can(role, p)),
    ) ?? [];

  const hasSubItems = visibleSubItems.length > 0;
  const isItemActive =
    item.url ? (isPathActive(pathname, item.url) ||
    visibleSubItems.some((subItem) => isPathActive(pathname, subItem.url))) : false;
  const shouldOpen = hasSubItems && isItemActive;
  const [open, setOpen] = React.useState(shouldOpen);

  React.useEffect(() => {
    setOpen(shouldOpen);
  }, [pathname, shouldOpen]);

  const menuButton = (
    <SidebarMenuButton asChild isActive={isItemActive} className={cn("!bg-transparent", isItemActive ? '!text-primary' : '')}>
      <Link to={item.url??"#"} onClick={()=> item?.onClick?.()}>
        {item.icon}
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  );

  if (!hasSubItems) {
    return <SidebarMenuItem>{menuButton}</SidebarMenuItem>;
  }

  return (
    <Collapsible asChild open={open} onOpenChange={setOpen}>
      <SidebarMenuItem>
        {menuButton}
        <CollapsibleTrigger asChild>
          <SidebarMenuAction className="data-[state=open]:rotate-90">
            <ChevronRight />
            <span className="sr-only">Toggle</span>
          </SidebarMenuAction>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarMenuSub>
            {visibleSubItems.map((subItem: {
              title: string,
              url: string,
              icon?: ReactNode
            }) => {
              const isSubItemActive = isPathActive(pathname, subItem.url);
              return (
                <SidebarMenuSubItem key={subItem.title}>
                  <SidebarMenuSubButton asChild isActive={isSubItemActive}>
                    <Link to={subItem.url}>
                      {subItem.icon}
                      <span>{subItem.title}</span>
                    </Link>
                  </SidebarMenuSubButton>
                </SidebarMenuSubItem>
              );
            })}
          </SidebarMenuSub>
        </CollapsibleContent>
      </SidebarMenuItem>
    </Collapsible>
  );
}

export function NavMain({
  items,
}: {
  items: NavItem[];
}) {
  const { user } = useAuth();
  const location = useLocation();
  const role: Role = user?.role ?? "viewer"; // Default to viewer role if no user is authenticated

  return (
    <SidebarGroup>
      <SidebarMenu>
        {items
          .filter(
            (item) =>
              !item.permissions?.length ||
              item.permissions.some((p) => can(role, p)),
          )
          .map((item) => (
            <NavMainItem
              key={item.title}
              item={item}
              role={role}
              pathname={location.pathname}
            />
          ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
