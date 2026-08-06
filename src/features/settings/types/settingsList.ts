export type SettingsToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  sortBy: string
  onSortByChange: (value: string) => void
  resetPage: () => void
}


export type MembersToolbarProps = {
  search: string
  onSearchChange: (value: string) => void
  statusFilter: string
  onStatusFilterChange: (value: string) => void
  roleFilter: string
  setRoleFilter: (value: string) => void
  resetPage: () => void
}

export type GroupType = 'office' | 'retail' | 'logistics' | 'public_access' | 'high_priority'

export type SettingsStatus = 'active' | 'maintenance' | 'offline'
export type SettingsStatusFilter = SettingsStatus | 'all'
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
  status: SettingsStatus
}

export type UserGroup = 'Amsterdam Offices' | 'Rotterdam Retail' | 'Utrecht Logistics';
export type PriorityLevel = 'High Priority' | 'Public Access';
export type UserStatus = 'Active' | 'Suspended';

export interface UserNotificationSettings {
  email: boolean;
  chat: boolean;
}
export type MemberRole =  "admin" | "viewer" | "editor"
export type MemberRoleFilter = MemberRole | "all"

export interface UserDashboardItem {
  id: string;
  name: string;
  title: string;
  avatarUrl: string;
  role: MemberRole;
  email: string;
  phone: string;
  group: UserGroup;
  priority: PriorityLevel;
  notifications: UserNotificationSettings;
  status: UserStatus;
}
