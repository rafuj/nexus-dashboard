import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { FileText, Search } from "lucide-react";
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/shared/components/ui/command";

type RouteItem = {
  title: string;
  description: string;
  path: string;
  keywords: string[];
};

const mockRouteList: RouteItem[] = [
  {
    title: "Dashboard",
    description: "Overview, stats and system activity",
    path: "/",
    keywords: ["home", "overview", "stats"],
  },
  {
    title: "Cabinets",
    description: "Browse and manage all cabinets",
    path: "/cabinets",
    keywords: ["locker", "list", "inventory"],
  },
  {
    title: "Cabinet Details",
    description: "View cabinet profile and activity",
    path: "/cabinetview",
    keywords: ["detail", "device", "single cabinet"],
  },
];

const isMacLike = /Mac|iPhone|iPad|iPod/.test(navigator.platform);

const MenuSearch = () => {
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const isShortcut =
        event.key.toLowerCase() === "k" && (event.metaKey || event.ctrlKey);
      if (!isShortcut) return;
      event.preventDefault();
      setOpen((prev) => !prev);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const routes = useMemo(
    () =>
      mockRouteList.map((item) => ({
        ...item,
        current: item.path === pathname,
      })),
    [pathname],
  );

  const handleSelect = (path: string) => {
    setOpen(false);
    if (path !== pathname) {
      navigate(path);
    }
  };

  return (
    <>
      <button
        className="flex items-center border border-border rounded-md text-xs h-8 px-2 gap-1 cursor-pointer"
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open global search"
      >
        <Search className="text-muted-foreground pointer-events-none size-3.5" />
        <span className="max-lg:hidden text-muted-foreground">
          Search pages
        </span>
        <span className="bg-secondary rounded text-xs px-1 select-none md:ml-6 xl:ml-10 max-lg:hidden">
          {isMacLike ? "⌘K" : "Ctrl+K"}
        </span>
      </button>

      <CommandDialog
        open={open}
        onOpenChange={setOpen}
        title="Global Search"
        description="Search and jump to a page"
      >
        <Command>
          <CommandInput
            placeholder="Type a page name or keyword..."
            className="text-xs"
          />
          <CommandList>
            <CommandEmpty>No matching page found.</CommandEmpty>
            <CommandGroup heading="Pages">
              {routes.map((route) => (
                <CommandItem
                  key={route.path}
                  value={`${route.title} ${route.description} ${route.keywords.join(" ")}`}
                  onSelect={() => handleSelect(route.path)}
                  className="cursor-pointer"
                >
                  <FileText className="size-4 text-muted-foreground" />
                  <div className="flex flex-col">
                    <span>{route.title}</span>
                    <span className="text-xs text-muted-foreground truncate">
                      {route.description}
                    </span>
                  </div>
                  {route.current && <CommandShortcut>Current</CommandShortcut>}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  );
};

export default MenuSearch;
