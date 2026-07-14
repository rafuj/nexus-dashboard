import { Book, BriefcaseBusiness, ChartSpline, CircleDollarSign, Code, File, FlaskConical, Globe, HeartPulse, Mic, Palette, Rocket, Settings, Shield, Sparkles, Users } from "lucide-react"
import type { LucideIcon } from "lucide-react";

export const groupIcons: {
  id: string;
  icon: LucideIcon;
}[] = [
  { id: "group-icon-1", icon: Users },
  { id: "group-icon-2", icon: BriefcaseBusiness },
  { id: "group-icon-3", icon: Code },
  { id: "group-icon-4", icon: Palette },
  { id: "group-icon-5", icon: Mic },
  { id: "group-icon-6", icon: ChartSpline },
  { id: "group-icon-7", icon: Shield },
  { id: "group-icon-8", icon: Rocket },
  { id: "group-icon-9", icon: Settings },
  { id: "group-icon-10", icon: Book },
  { id: "group-icon-11", icon: HeartPulse },
  { id: "group-icon-12", icon: Globe },
  { id: "group-icon-13", icon: FlaskConical },
  { id: "group-icon-14", icon: CircleDollarSign },
  { id: "group-icon-15", icon: Sparkles },
  { id: "group-icon-16", icon: File },
];

export const selectedGroupIcon = (id: string): LucideIcon | undefined => {
  return groupIcons.find((item) => item.id === id)?.icon;
};