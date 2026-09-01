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

    function getZoomFromBounds(bounds: { north: number; south: number; east: number; west: number }) {
        const latDiff = Math.abs(bounds.north - bounds.south);
        const lngDiff = Math.abs(bounds.east - bounds.west);
        const maxDiff = Math.max(latDiff, lngDiff);

        if (maxDiff < 0.01) return 15;
        if (maxDiff < 0.05) return 13;
        if (maxDiff < 0.2) return 11;
        if (maxDiff < 1) return 9;
        if (maxDiff < 5) return 7;
        return 5;
    }

    const { defaultCenter, defaultZoom } = useMemo(() => {
        const validCabinets = cabinets.filter(
            (c) => c.latitude != null && c.longitude != null && Number(c.latitude) !== 0
        );

        if (!validCabinets.length) {
            return { defaultCenter: { lat: 40.416775, lng: -3.70379 }, defaultZoom: 6 }; // Default fallback (e.g., Spain)
        }

        let minLat = Infinity, maxLat = -Infinity, minLng = Infinity, maxLng = -Infinity;
        let sumLat = 0, sumLng = 0;

        validCabinets.forEach((c) => {
            const lat = Number(c.latitude);
            const lng = Number(c.longitude);
            minLat = Math.min(minLat, lat);
            maxLat = Math.max(maxLat, lat);
            minLng = Math.min(minLng, lng);
            maxLng = Math.max(maxLng, lng);
            sumLat += lat;
            sumLng += lng;
        });

        const center = {
            lat: sumLat / validCabinets.length,
            lng: sumLng / validCabinets.length,
        };

        const zoom = getZoomFromBounds({ north: maxLat, south: minLat, east: maxLng, west: minLng });

        return { defaultCenter: center, defaultZoom: zoom };
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
                        defaultZoom={defaultZoom}
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