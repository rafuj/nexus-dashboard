import { Card, CardContent, CardHeader, CardTitle } from "@/shared/components/ui/card";
import { Badge } from "@/shared/components/ui/badge";
import { mockCabinet } from "../mock/mockCabinet";
import {Lock, LockOpen, MapPin} from "lucide-react"

import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/shared/components/ui/table"

import {
    Map,
    MapMarker,
    MapPopup,
    MapTileLayer,
    MapZoomControl,
} from "@/shared/components/ui/map"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"


const CabinetView = () => {
  const cabinet = mockCabinet;

  return (
    <>
    <div className="p-4 space-y-6">
      <Card>

<CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
  <div>
    <CardTitle>Cabinet X</CardTitle>

  </div>
      <Dialog>
        <DialogTrigger asChild>
          <Badge variant="outline" className="flex items-center gap-1">
      <MapPin className="w-4 h-4" />
      Jan van galenstraat 1390, 1061AZ Amsterdam
    </Badge>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Jan van galenstraat 1390</DialogTitle>
            <DialogDescription>1061AZ Amsterdam</DialogDescription>
          </DialogHeader>
                <Map center={[cabinet.module.lat, cabinet.module.long]}>
                    <MapTileLayer />
                    <MapZoomControl />
                    <MapMarker position={[cabinet.module.lat, cabinet.module.long]}>
                        <MapPopup>{cabinet.module.imei}</MapPopup>
                    </MapMarker>
                </Map>
        </DialogContent>
    </Dialog>
</CardHeader>

        <CardContent className="flex flex-col space-y-2" >
          <div className="flex flex-row space-x-5"> 
              <div className="flex flex-row space-x-1">
                  <span ><Badge className="bg-green-500" variant="default">Active</Badge></span>
                  <span><Badge  className={cabinet.doorOpen ? "bg-red-500" : "bg-green-500"}>{cabinet.doorOpen ? (<><LockOpen />Open</> ): (<><Lock /> Closed</>)}</Badge></span>
                  <span><Badge  className={cabinet.aedInside ? "bg-green-500" : "bg-red-500"}>AED {cabinet.aedInside ? "Inside" : "Out"}</Badge></span>
                  <span ><Badge className="bg-green-500">27°C</Badge></span>  

                  {/* Bij temp lager as 0 of hoger als 45 -> rood-badge.. */}
                  
              </div>
          </div>
        </CardContent>
      </Card>
      </div>
      <div className="flex flex-row">
        <div className="flex-1">
        </div>
        <div className="flex-1">
          <Card>
            <CardContent>
              <Table>
                <TableCaption>SmartCabinet recent activity</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="">Timestamp</TableHead>
                    <TableHead>Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                <TableRow>
                  <TableCell>17-3-2026 08:21</TableCell>
                  <TableCell>Door opened</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>17-3-2026 08:22</TableCell>
                  <TableCell>AED taken</TableCell>
                </TableRow>       
                <TableRow>
                  <TableCell>17-3-2026 08:22</TableCell>
                  <TableCell>Door Closed</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>17-3-2026 08:36</TableCell>
                  <TableCell>Door opened</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>17-3-2026 08:37</TableCell>
                  <TableCell>AED returned</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell>17-3-2026 08:37</TableCell>
                  <TableCell>Door Closed</TableCell>
                </TableRow>         
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

    </div>
    </>
  );
};

export default CabinetView;