import React, { useMemo, type Dispatch, type SetStateAction } from 'react';
import { Map, APIProvider, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import { Icons } from '@/app/icons/icons';
import { cn, formatDateTime } from '@/lib/utils';
import { Link } from 'react-router';
import type { SmartCabinet } from '../types/cabinetList';
import { getOverallStatus, getOverallStatusBadgeClass } from '../lib/cabinetListDisplay';

// Map status to Hex codes specifically for Google's native <Pin /> element
const pinHexConfig = {
  paused: "#7b7d97",
  ok: "#308446",
  warning: "#E15501",
  urgent: "#CC0605",
  "n/a": "#7b7d97",
};

interface CabinetMapProps {
  cabinets: SmartCabinet[];
  openCabinetId: string | null;
  setOpenCabinetId: Dispatch<SetStateAction<string | null>>;
}
export default function CabinetMapCard({ cabinets, openCabinetId, setOpenCabinetId }: CabinetMapProps) {

    const defaultCenter = useMemo(() => {
        if (!cabinets.length) return undefined;

        const cityCounts = cabinets.reduce<
            Record<string, { count: number; lat: number; lng: number }>
        >((acc, cabinet) => {
            if (!cabinet.city || cabinet.latitude == null || cabinet.longitude == null) {
            return acc;
            }

            if (!acc[cabinet.city]) {
            acc[cabinet.city] = {
                count: 0,
                lat: 0,
                lng: 0,
            };
            }

            acc[cabinet.city].count += 1;
            acc[cabinet.city].lat += Number(cabinet.latitude);
            acc[cabinet.city].lng += Number(cabinet.longitude);

            return acc;
        }, {});

        const mostCommonCity = Object.values(cityCounts).sort(
            (a, b) => b.count - a.count
        )[0];

        if (!mostCommonCity) return undefined;

        return {
            lat: mostCommonCity.lat / mostCommonCity.count,
            lng: mostCommonCity.lng / mostCommonCity.count,
        };
    }, [cabinets]);

    return (
        <div className="relative">
            <div className="md:z-10 md:absolute md:top-5 md:right-5 rounded-xl py-5 px-4 bg-white border border-border mb-2.5 text-xs text-accent-foreground min-w-[246px]">
                <h6 className="text-sm mb-3 font-semibold">Overall Status</h6>
                <div className="px-1 flex flex-col gap-3">
                    <div className="flex items-center justify-between gap-3 xl:gap-x-6">
                        <div className="flex gap-1.75 items-center">
                            <Icons.map className="text-success" />
                            OK
                        </div>
                        <span className="font-semibold">
                            {cabinets.filter((c) => getOverallStatus(c) === "ok").length}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 xl:gap-x-6">
                        <div className="flex gap-1.75 items-center">
                            <Icons.map className="text-warning" />
                            Warning
                        </div>
                        <span className="font-semibold">
                            {cabinets.filter((c) => getOverallStatus(c) === "warning").length}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 xl:gap-x-6">
                        <div className="flex gap-1.75 items-center">
                            <Icons.map className="text-error" />
                            Urgent
                        </div>
                        <span className="font-semibold">
                            {cabinets.filter((c) => getOverallStatus(c) === "urgent").length}
                        </span>
                    </div>
                    <div className="flex items-center justify-between gap-3 xl:gap-x-6">
                        <div className="flex gap-1.75 items-center">
                            <Icons.map className="text-foreground" />
                            Paused
                        </div>
                        <span className="font-semibold">
                            {cabinets.filter((c) => getOverallStatus(c) === "paused").length}
                        </span>
                    </div>
                </div>
                <div className="border-t flex justify-between font-semibold pt-3 mt-3">
                    <span>Total Cabinets</span>
                    <span>{cabinets.length || 0}</span>
                </div>
            </div>
            <div className="min-h-[450px] h-full rounded-xl overflow-hidden relative">
                <APIProvider apiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}>
                    <Map
                        defaultCenter={defaultCenter}
                        defaultZoom={12}
                        mapId="NEXUS_CLUSTER_MAP" // Required for AdvancedMarker pin colors
                        disableDefaultUI={false}
                        zoomControl={true}
                        fullscreenControlOptions={{
                            position: 9 
                        }}
                        fullscreenControl={false}   // Removes the fullscreen target icon
                        streetViewControl={false}   // Removes the orange Pegman icon
                        mapTypeControl={false}
                    >
                    {cabinets.map((cabinet) => {
                        const position = {
                            lat: cabinet?.latitude || 0,
                            lng: cabinet?.longitude || 0
                        }
                        
                        // Skip compiling marker if coordinates map fallback lacks definition 
                        if (!position.lat || !position.lng) return null;

                        return (
                        <React.Fragment key={cabinet.id}>
                            {/* 1. Interactive Marker Instance */}
                            <AdvancedMarker
                            position={position}
                            title={cabinet.name}
                            onClick={() => setOpenCabinetId(cabinet.id)}
                            >
                            <Pin
                                background={pinHexConfig[getOverallStatus(cabinet) as keyof typeof pinHexConfig] ?? "#7b7d97"}
                                borderColor={pinHexConfig[getOverallStatus(cabinet) as keyof typeof pinHexConfig] ?? "#7b7d97"}
                                glyphColor="#ffffff"
                            />
                            </AdvancedMarker>

                            {/* 2. Popover */}
                            {openCabinetId === cabinet.id && (
                            <InfoWindow
                                position={position}
                                // onCloseClick={() => setOpenCabinetId(null)}
                            >
                                <div className="p-1 min-w-[260px] font-sans text-accent-foreground text-xs">
                                
                                    {/* Top Header Label */}
                                    <Link to={`/cabinets/monitor?id=${cabinet.id}`}>
                                        <h3 className="text-sm font-semibold pb-2 underline">
                                            {cabinet.name}
                                        </h3>
                                    </Link>
                                    
                                    {/* Details Rows */}
                                    <div className="flex justify-between py-1.5">
                                        <span>Address</span>
                                        <span className="font-semibold">{cabinet.number} {cabinet.street}</span>
                                    </div>
    {/*                                 
                                    <div className="flex justify-between py-1.5">
                                        <span>Asset type</span>
                                        <span className="font-semibold w-0 grow text-end">
                                            {cabinet.type}
                                        </span>
                                    </div> */}

                                    <div className="flex justify-between py-1.5">
                                        <span>City</span>
                                        <span className="font-semibold w-0 grow text-end">
                                            {cabinet.city}
                                        </span>
                                    </div>
    {/*                                 
                                    {cabinet.temperature !== null && (
                                        <div className="flex justify-between py-1.5">
                                        <span>Temperature</span>
                                        <span className="font-semibold">{cabinet.temperature}°C</span>
                                        </div>
                                    )} */}
                                    
                                    {/* Operational Status Line */}
                                    <div className="flex justify-between py-1.5">
                                        <span>Overall Status</span>
                                        <span className={cn(`font-semibold capitalize ${getOverallStatusBadgeClass(cabinet)} bg-transparent`)}>
                                            {/* {cabinet.status} */}
                                            {getOverallStatus(cabinet)}
                                        </span>
                                    </div>

                                    <div className="flex justify-between pt-1.5">
                                        <span>Last update</span>
                                        <span className="font-semibold">
                                            {formatDateTime(cabinet?.deviceState?.lastSeenAt ? cabinet?.deviceState?.lastSeenAt : cabinet?.createdAt)}
                                        </span>
                                    </div>

                                </div>
                            </InfoWindow>
                            )}
                        </React.Fragment>
                        );
                    })}
                    </Map>
                </APIProvider>
            </div>
        </div>
    );
}