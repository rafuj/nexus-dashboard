"use client";
import { Helmet } from "react-helmet-async";
import { ChevronRight, MapPin, PlusCircle } from "lucide-react";

import { CabinetsListToolbar } from "../components/CabinetsListToolbar";
import { cn } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Link } from "react-router";
import { useState } from "react";
import { mockCabinetsList } from "../mock/mockCabinetsList";
import { cabinetConfig } from "../types/cabinetList";


const STATUS_FILTER_ALL = "all";
const CITIES_FILTER_ALL = "all";
const STREETS_FILTER_ALL = "all";


export default function CabinetsMapView() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>(STATUS_FILTER_ALL);
  const [cities, setCities] = useState<string>(CITIES_FILTER_ALL);
  const [streets, setStreets] = useState<string>(STREETS_FILTER_ALL);
  

  return (
    <>
      <Helmet>
        <title>Cabinets | Updaid</title>
      </Helmet>

      <main>
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

        <div className="p-5">
          <div className="flex flex-wrap md:flex-nowrap gap-5 items-center justify-between mb-5">
            <h2 className="text-xl md:text-2xl font-semibold">
              All cabinet locations in your fleet
            </h2>
          </div>
          <section aria-label="Cabinets">
            <div className="mb-2.5">
              <CabinetsListToolbar
                search={search}
                onSearchChange={(v) => {
                  setSearch(v);
                }}
                statusFilter={statusFilter}
                onStatusFilterChange={(v) => {
                  setStatusFilter(v);
                }}
                streets={streets}
                onStreetsChange={(v) => {
                  setStreets(v)
                }}
                cities={cities}
                onCitiesChange={(v) => {
                  setCities(v)
                }}
              />
            </div>
            <div className={cn("flex flex-wrap gap-2.5", {
              "xl:grid xl:grid-cols-[830fr_310fr]": search
            })}>
              <div
                className={cn(
                  "border rounded-[10px] border-border py-5 px-4 w-full grow md:w-0 xl:w-full",
                  {
                    "": search
                  }
                )}
              >
              </div>
              <div
                className={cn(
                  "w-full md:w-[240px] lg:w-[310px] xl:w-full",
                  {
                    "hidden": !search
                  }
                )}
              >
                <div className="grid grid-cols-1 gap-2.5">
                  {mockCabinetsList.map((cabinet) => {
                    // Fallback to active theme if state isn't recognized
                    const config = cabinetConfig[cabinet.status] || cabinetConfig.active

                    return (
                      <div
                        key={cabinet.id}
                        className={cn(
                          "flex flex-col p-4.5 rounded-2xl border text-accent-foreground border-border text-xs",
                          config.bg
                        )}
                      >
                        {/* Header section (Icon, Title, Status Badge) */}
                        <div className="flex items-start justify-between mb-5 gap-2">
                          <div className="flex items-center gap-1.75">
                            <div className="h-6 w-6 shrink-0 flex items-center justify-center">
                              <MapPin className={cn("text-primary", config.pin)} size={20} />
                            </div>
                            <h3 className="text-sm font-semibold line-clamp-1">
                              {cabinet.name}
                            </h3>
                          </div>
                          <span
                            className={cn(
                              "px-3 py-1 text-xs rounded-[4px] whitespace-nowrap",
                              config.badge
                            )}
                          >
                            {config.label}
                          </span>
                        </div>

                        {/* Content data rows matching card layout specs */}
                        <div className="flex flex-col gap-2.5">
                          <div className="flex justify-between items-baseline">
                            <span>Updaid Code</span>
                            <span className="font-semibold text-right truncate">
                              {cabinet.updaidCode}
                            </span>
                          </div>
                          
                          <div className="flex justify-between items-baseline">
                            <span>City / Street</span>
                            <span className="font-semibold text-right truncate">
                              {cabinet.city}, {cabinet.street} {cabinet.hNo}
                            </span>
                          </div>

                          <div className="flex justify-between items-baseline">
                            <span>Cabinet Code</span>
                            <span className="font-semibold text-right truncate">
                              {cabinet.cabinetCode}
                            </span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
