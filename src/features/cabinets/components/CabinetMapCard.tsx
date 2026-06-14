import React, { type Dispatch, type SetStateAction } from 'react';
import { Map, APIProvider, AdvancedMarker, Pin, InfoWindow } from '@vis.gl/react-google-maps';
import type { CabinetListRow } from '../types/cabinetList';


// Map status to Hex codes specifically for Google's native <Pin /> element
const pinHexConfig = {
  active: "#308446",
  maintenance: "#E15501",
  offline: "#CC0605",
  paused: "#003E91",
};

// Text color mappings matching your custom popover text styling
const textColorConfig = {
  active: "text-success",
  maintenance: "text-warning",
  offline: "text-error",
  paused: "text-info",
};
interface CabinetMapProps {
  cabinets: CabinetListRow[];
  openCabinetId: string | null;
  setOpenCabinetId: Dispatch<SetStateAction<string | null>>;
}
export default function CabinetDashboardMap({ cabinets, openCabinetId, setOpenCabinetId }: CabinetMapProps) {
  

  // Focus layout camera dynamically around center of Amsterdam coordinates
  const defaultCenter = { lat: 52.3676, lng: 4.9041 };

  return (
    <div className="w-full h-[650px] rounded-xl overflow-hidden">
      <APIProvider apiKey="AIzaSyDMxlZXKWT-s7LzKSYMztoOUSnZyTEnsiw">
        <Map
          defaultCenter={defaultCenter}
          defaultZoom={12}
          mapId="NEXUS_CLUSTER_MAP" // Required for AdvancedMarker pin colors
          disableDefaultUI={false}
        >
          {cabinets.map((cabinet) => {
            const position = cabinet.locationCoordinates
            
            // Skip compiling marker if coordinates map fallback lacks definition 
            if (!position) return null;

            return (
              <React.Fragment key={cabinet.id}>
                {/* 1. Interactive Marker Instance */}
                <AdvancedMarker
                  position={position}
                  title={cabinet.name}
                  onClick={() => setOpenCabinetId(cabinet.id)}
                >
                  <Pin
                    background={pinHexConfig[cabinet.status] || "#64748b"}
                    borderColor={pinHexConfig[cabinet.status] || "#64748b"}
                    glyphColor="#ffffff"
                  />
                </AdvancedMarker>

                {/* 2. Popover matching your dashboard visual styles */}
                {openCabinetId === cabinet.id && (
                  <InfoWindow
                    position={position}
                    // onCloseClick={() => setOpenCabinetId(null)}
                  >
                    <div className="p-1 min-w-[260px] font-sans text-accent-foreground text-xs">
                      
                      {/* Top Header Label */}
                      <h3 className="text-sm font-semibold pb-2">
                        {cabinet.cabinetCode}
                      </h3>
                      
                      {/* Details Rows */}
                      <div className="flex justify-between items-center py-1.5">
                        <span>Cabinet Name</span>
                        <span className="font-semibold">{cabinet.name}</span>
                      </div>
                      
                      <div className="flex justify-between items-center py-1.5">
                        <span>City</span>
                        <span className="font-semibold">
                          {cabinet.city}, {cabinet.zip}
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-start py-1.5">
                        <span className="text-slate-500 font-medium whitespace-nowrap mr-2">Updaid Code</span>
                        <span className="font-semibold">
                          {cabinet.updaidCode}
                        </span>
                      </div>

                      { cabinet.temperatureC !== null && (
                        <div className="flex justify-between items-center py-1.5">
                          <span>Temperature</span>
                          <span className="font-semibold">{cabinet.temperatureC}°C</span>
                        </div>
                      )}
                      
                      {/* Operational Status Line */}
                      <div className="flex justify-between items-center pt-1.5">
                        <span>Status</span>
                        <span className={`font-semibold capitalize ${textColorConfig[cabinet.status] || ""}`}>
                          ● {cabinet.status}
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
  );
}