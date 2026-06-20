import type { Role } from "@/lib/permissions"

export type SettingsToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  typeFilter: string
  onTypeFilterChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
}
export type GroupType = 'office' | 'retail' | 'logistics' | 'public_access' | 'high_priority'

export type SettingsGroupRow = {
  id: string;
  name: string;
  description: string;
  type: GroupType;
  cabinetsCount: number;
  members: {
    avatarUrls: string[];
    additionalCount: number;
  };
  lastUpdated: {
    date: string;
    by: string;
  };
}



export type UserGroup = 'Amsterdam Offices' | 'Rotterdam Retail' | 'Utrecht Logistics';
export type PriorityLevel = 'High Priority' | 'Public Access';
export type UserStatus = 'Active' | 'Suspended';

export interface UserNotificationSettings {
  email: boolean;
  chat: boolean;
}

export interface UserDashboardItem {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  role: Role;
  email: string;
  phone: string;
  group: UserGroup;
  priority: PriorityLevel;
  notifications: UserNotificationSettings;
  status: UserStatus;
}
