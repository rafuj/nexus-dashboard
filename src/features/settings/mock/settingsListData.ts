import type { SettingsGroupRow } from "../types/settingsList";

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