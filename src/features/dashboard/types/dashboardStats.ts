import type { ComponentType } from "react"

type IconProps = {
  className?: string;
};

export type DashboardStatDefinition = {
  id: string
  title: string
  value: string
  hint?: string
  icon: ComponentType<IconProps>;
  className?: string
}

export type RecentActivityDefinition = {
  id: string | number | undefined | null
  date: string
  cabinetId: string
  activity: string
  type: "aed" | "door" | "maintenance" | "temperature" | "user" | "system"

}
export type SystemLogsDefinition = {
  id: string | number | undefined | null
  date: string
  activity: string
  type: "user" | "system"
}

