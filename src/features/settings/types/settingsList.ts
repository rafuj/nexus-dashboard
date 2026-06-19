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


export type SettingsMembersRow = {
  id: string
  name: string
  serial: string
  location: string
  locationCoordinates: { lat: number; lng: number }
  asset: "aed" | "none"
  temperatureC: number | null
  lastActivityAt: string
  city: string
  zip: string
  street: string
  hNo: string
  cabinetCode: string
  updaidCode: string
}
