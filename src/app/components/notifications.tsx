import {
  BellDot,
  CircleCheckBig,
  Clock3,
  ShieldAlert,
  TriangleAlert,
} from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";

type NotificationLog = {
  id: number;
  title: string;
  subtitle: string;
  time: string;
  icon: typeof CircleCheckBig;
};

const mockLogs: NotificationLog[] = [
  {
    id: 1,
    title: "Cabinet Synced",
    subtitle: "Cabinet A-104 synced successfully.",
    time: "2 min ago",
    icon: CircleCheckBig,
  },
  {
    id: 2,
    title: "Door Left Open",
    subtitle: "Cabinet C-220 has been open for 6 minutes.",
    time: "8 min ago",
    icon: TriangleAlert,
  },
  {
    id: 3,
    title: "Admin Login",
    subtitle: "New admin login from Dhaka, Bangladesh.",
    time: "21 min ago",
    icon: ShieldAlert,
  },
  {
    id: 4,
    title: "Maintenance Due",
    subtitle: "Scheduled service for Cabinet B-012 starts at 3:00 PM.",
    time: "1 hr ago",
    icon: Clock3,
  },
];

const Notifications = () => {
  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="outline"
            className="rounded-sm bg-secondary border-0 px-0 w-8 h-8 cursor-pointer outline-0 shadow-0"
          >
            <BellDot className="size-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-80 p-3" align="end">
          <DropdownMenuGroup>
            <DropdownMenuLabel>Activity Logs</DropdownMenuLabel>
            {mockLogs.map((log) => {
              const Icon = log.icon;
              return (
                <DropdownMenuItem
                  key={log.id}
                  className="items-start gap-3 py-3 cursor-default"
                >
                  <Icon className="mt-0.5 size-4 text-muted-foreground shrink-0" />
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium leading-none">
                      {log.title}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground truncate">
                      {log.subtitle}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {log.time}
                    </p>
                  </div>
                </DropdownMenuItem>
              );
            })}
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Notifications;
