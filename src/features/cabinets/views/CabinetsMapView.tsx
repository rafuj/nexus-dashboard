import { Helmet } from "react-helmet-async";
import { ChevronRight, PlusCircle } from "lucide-react";

import { CabinetsListToolbar } from "../components/CabinetsListToolbar";
import { cn, formatDateTime } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Link } from "react-router";
import { useState } from "react";
import { cabinetConfig, type CabinetStatus, type FilterStatus } from "../types/cabinetList";
import CabinetMapCard from "../components/CabinetMapCard";
import MapPin from "@/assets/icons/map-pin.svg?react"
import { parseAsStringLiteral, useQueryState } from "nuqs";
import { useDebounce } from "@/app/hooks/use-debounce";
import { Skeleton } from "@/shared/components/ui/skeleton";
import { useSmartCabinetsList } from "../hooks/useSmartCabinetsList";
import { filterCabinets } from "../server/queryCabinetsMonitorPage";
import { getOverallStatus } from "../lib/cabinetListDisplay";

const STATUS_FILTER_ALL = "all";
const CITY_FILTER_ALL = "all";
const filterStatuses = [
  "paused",
  "ok",
  "warning",
  "urgent",
  "all"
] as const satisfies readonly CabinetStatus[];

export default function CabinetsMapView() {
  const [openSidebar, setOpenSidebar] = useState<boolean>(false);
  const [search, setSearch] = useQueryState("search", { defaultValue:"" });
  const [statusFilter, setStatusFilter] = useQueryState("status", parseAsStringLiteral(filterStatuses).withDefault(STATUS_FILTER_ALL))
  const [city, setCity] = useQueryState("city", { defaultValue: CITY_FILTER_ALL });

  const [openCabinetId, setOpenCabinetId] = useState<string | null>(null);

  const debouncedSearch = useDebounce(search, 400)
  const {
    data,
    isFetching,
    refetch,
  } = useSmartCabinetsList({
    search: debouncedSearch,
    status: statusFilter,
    city,
    page: 1,
    limit: 9999999
  })

  const filteredCabinets = filterCabinets(
      data || [],
      debouncedSearch,
      statusFilter,
      "",
      city
    )

  const resetPage = () => {
    setSearch("")
    setStatusFilter(STATUS_FILTER_ALL)
    setCity(CITY_FILTER_ALL)
  }

  const onRefresh = () => {
    refetch()
    resetPage()
  }

  return (
    <>
      <Helmet>
        <title>Cabinets | Updaid</title>
      </Helmet>

      <main className="flex lg:h-screen flex-col">
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-3 md:gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
              <div className="md:w-0 grow">
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Cabinets</h1>
                <ul className="text-xs lg:text-sm flex flex-wrap items-center">
                  <li>Cabinets</li>
                  <li className="mx-2"><ChevronRight size={20} /></li>
                  <li className="text-accent-foreground">List</li>
                </ul>
              </div>
              <div className="flex items-center max-sm:flex-wrap gap-2.5">
                <div className="max-sm:hidden">
                  <DateAndTimeChip />
                </div>
                <Link to="/cabinets/add" className="flex items-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                  <PlusCircle/> <span>Add Cabinet</span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5 lg:h-0 grow flex flex-col">
          <div className="flex flex-wrap md:flex-nowrap gap-5 items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-semibold">
              All cabinet locations in your fleet
            </h2>
          </div>
          <div className="mb-2.5">
            <CabinetsListToolbar
                search={search}
                onSearchChange={(v) => {
                  setSearch(v);
                  setOpenSidebar(true);
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(v) => {
                  setStatusFilter(v as FilterStatus);
                }}
                city={city}
                onCityChange={(v) => {
                  setCity(v);
                }}
                resetPage={resetPage}
                onRefresh={onRefresh}
              />
          </div>
          <section className={cn("lg:h-0 grow gap-2.5 grid grid-cols-1",{"lg:grid-cols-[830fr_310fr]": openSidebar})} aria-label="Cabinets">
            {(isFetching && !data) ? (
              <div className="p-5 bg-white border border-border rounded-md">
                  <div className="grid gap-4 grid-cols-[4fr_1fr] h-full">
                    <Skeleton className="h-full" />
                    <Skeleton className="h-full" />
                  </div>
              </div>
            ) : (
              <>
                <CabinetMapCard cabinets={filteredCabinets} openCabinetId={openCabinetId} setOpenCabinetId={setOpenCabinetId}  />
                <div
                  className={cn(
                    "overflow-y-auto rounded-[10px] overflow-x-hidden",
                    {
                      "hidden": !openSidebar
                    }
                  )}
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-2.5">
                    {filteredCabinets.map((cabinet) => {
                      const config = cabinetConfig[getOverallStatus(cabinet) as keyof typeof cabinetConfig] ?? cabinetConfig.urgent
                      return (
                        <div
                          key={cabinet.id}
                          className={cn(
                            "flex flex-col p-4.5 rounded-2xl border text-accent-foreground border-border text-xs cursor-pointer overflow-hidden",
                            config.bg
                          )}
                          onClick={()=> setOpenCabinetId(cabinet.id)}
                        >
                          {/* Header section (Icon, Title, Status Badge) */}
                          <div className="flex items-start flex-wrap justify-between mb-5 gap-2">
                            <div className="flex items-center gap-1.75">
                              <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                                <MapPin className={cn("text-primary size-5", config.pin)} />
                              </div>
                              <Link to={`/cabinets/monitor?id=${cabinet.id}`}>
                                  <h3 className="text-sm font-semibold line-clamp-1 underline">
                                    {cabinet.name}
                                  </h3>
                              </Link>
                            </div>
                            <span
                              className={cn(
                                "px-3 py-1 text-xs rounded-[4px] whitespace-nowrap capitalize",
                                config.badge
                              )}
                            >
                              {getOverallStatus(cabinet)}
                            </span>
                          </div>

                          {/* Content data rows matching card layout specs */}
                          <div className="flex flex-col gap-2.5">
                            <div className="flex justify-between items-baseline">
                              <span>Address</span>
                              <span className="font-semibold text-right truncate">
                                {cabinet.number}, {cabinet.street}
                              </span>
                            </div>
                            
                            <div className="flex justify-between items-baseline gap-4">
                              <span>City</span>
                              <span className="font-semibold text-right truncate w-0 grow">
                                {cabinet.city}
                              </span>
                            </div>

                            <div className="flex justify-between items-baseline">
                              <span>Last Update</span>
                              <span className="font-semibold text-right truncate">
                                {formatDateTime(cabinet?.deviceState?.lastSeenAt ? cabinet?.deviceState?.lastSeenAt : cabinet?.createdAt)}
                              </span>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}
          </section>
        </div>
      </main>
    </>
  );
}
