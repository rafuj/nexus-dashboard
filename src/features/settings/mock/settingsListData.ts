import type { SettingsGroupRow, UserDashboardItem } from "../types/settingsList";

export const mockGroupData: SettingsGroupRow[] = [
  {
    id: "1",
    name: "Amsterdam Offices",
    description: "Office locations in Amsterdam",
    type: "office",
    cabinetsCount: 48,
    members: {
      avatarUrls: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      ],
      additionalCount: 5
    },
    lastUpdated: {
      date: "May 25, 2026",
      by: "Emma de Vries"
    }
  },
  {
    id: "2",
    name: "Rotterdam Retail",
    description: "Retail stores in Rotterdam",
    type: "retail",
    cabinetsCount: 62,
    members: {
      avatarUrls: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      ],
      additionalCount: 5
    },
    lastUpdated: {
      date: "May 24, 2026",
      by: "Lucas Jansen"
    }
  },
  {
    id: "3",
    name: "Utrecht Logistics",
    description: "Logistics & warehouse sites",
    type: "logistics",
    cabinetsCount: 36,
    members: {
      avatarUrls: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      ],
      additionalCount: 5
    },
    lastUpdated: {
      date: "May 23, 2026",
      by: "Sophie Bakker"
    }
  },
  {
    id: "4",
    name: "Public Access",
    description: "Public accessible cabinets",
    type: "public_access",
    cabinetsCount: 24,
    members: {
      avatarUrls: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      ],
      additionalCount: 5
    },
    lastUpdated: {
      date: "May 22, 2026",
      by: "Noah Visser"
    }
  },
  {
    id: "5",
    name: "High Priority",
    description: "Mission critical cabinets",
    type: "high_priority",
    cabinetsCount: 18,
    members: {
      avatarUrls: [
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
      ],
      additionalCount: 5
    },
    lastUpdated: {
      date: "May 21, 2026",
      by: "John Smith"
    }
  }
];




// Mock data for settings members

export const membersData: UserDashboardItem[] = [
  {
    id: "1",
    name: "Phillip Herwitz",
    title: "Operations Manager",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    role: "admin",
    email: "phillip@updaid.com",
    phone: "+31 612 321 0932",
    group: "Amsterdam Offices",
    priority: "High Priority",
    notifications: { email: true, chat: true },
    status: "Active"
  },
  {
    id: "2",
    name: "Emerson Siphron",
    title: "Facility Coordinator",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    role: "admin", // Mapped from Editor
    email: "emerson@updaid.com",
    phone: "+31 928 348 1992",
    group: "Rotterdam Retail",
    priority: "Public Access",
    notifications: { email: false, chat: true },
    status: "Suspended"
  },
  {
    id: "3",
    name: "Wilson Schleifer",
    title: "Operations Manager",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    role: "admin", // Mapped from Editor
    email: "wilson@updaid.com",
    phone: "+31 842 293 1102",
    group: "Utrecht Logistics",
    priority: "High Priority",
    notifications: { email: true, chat: true },
    status: "Active"
  },
  {
    id: "4",
    name: "Roger Bator",
    title: "Facility Coordinator",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    role: "viewer",
    email: "roger@updaid.com",
    phone: "+31 772 013 4832",
    group: "Amsterdam Offices",
    priority: "High Priority",
    notifications: { email: false, chat: true },
    status: "Active"
  },
  {
    id: "5",
    name: "Ahmad Carder",
    title: "Facility Coordinator",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    role: "admin", // Mapped from Editor
    email: "ahmad@updaid.com",
    phone: "+31 928 348 1992",
    group: "Rotterdam Retail",
    priority: "Public Access",
    notifications: { email: false, chat: true },
    status: "Suspended"
  },
  {
    id: "6",
    name: "Craig George",
    title: "Operations Manager",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    role: "viewer",
    email: "craig@updaid.com",
    phone: "+31 842 293 1102",
    group: "Utrecht Logistics",
    priority: "High Priority",
    notifications: { email: true, chat: true },
    status: "Active"
  },
  {
    id: "7",
    name: "Jaxson Septimus",
    title: "Facility Coordinator",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    role: "admin",
    email: "jaxson@updaid.com",
    phone: "+31 772 013 4832",
    group: "Amsterdam Offices",
    priority: "High Priority",
    notifications: { email: false, chat: true },
    status: "Active"
  },
  {
    id: "8",
    name: "Cristofer Bator",
    title: "Facility Coordinator",
    avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80",
    role: "admin", // Mapped from Editor
    email: "cristofer@updaid.com",
    phone: "+31 928 348 1992",
    group: "Rotterdam Retail",
    priority: "Public Access",
    notifications: { email: false, chat: true },
    status: "Suspended"
  }
];