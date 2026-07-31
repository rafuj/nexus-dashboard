
export type Status = 'urgent' | 'ok' | 'warning' | 'paused';
export type FilterStatus = Status | 'all';

export type CabinetMonitorToolbarProps = {
  search: string;
  onSearchChange: (value: string) => void;
  city: string;
  setCity: (value: string) => void;
  status: FilterStatus; // Changed from string
  setStatus: (value: FilterStatus) => void; // Changed from string
};
