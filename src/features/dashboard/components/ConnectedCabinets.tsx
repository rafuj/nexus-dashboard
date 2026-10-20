import connectedCabinetsBg from "@/assets/connected-cabinets-bg.png"
import { systemHealthData } from "../mock/mockDashboardStats";
import { Link } from 'react-router';
import type { SystemHelthDefination } from '../types/dashboardStats';
import { useEventsList } from '@/features/cabinets/hooks/useEventsList';
import type { CabinetEventRow } from '@/features/cabinets/types/eventList';
import { cn, formatMonDayTime } from '@/lib/utils';
import { ActivityIcons, Icons } from "@/app/icons/icons";
import { ChevronRight } from "lucide-react";
import { Skeleton } from "@/shared/components/ui/skeleton";

export default function ConnectedCabinets({ data }: { data: any }) {

    const { data:events, isFetching, isRefetching } = useEventsList({})

    const switchIcon = (value: string) => {
        switch (value) {
            case 'repaired':
            case 'damaged':
            case 'checked':
            case 'pads replaced':
                return <ActivityIcons.padsReplaced />
            case 'stolen':
                return <ActivityIcons.openDoor />
            case 'battery replaced':
                return <ActivityIcons.batteryReplaced />
            default:
                return <ActivityIcons.padsReplaced />
        }
    }

    return (
        <div className="p-5 relative border rounded-[15px] bg-white">
            <div className="mb-4">
                <h2 className="text-sm mb-1.5 font-semibold">Connected Cabinets ({data?.smartCabinets || 0})</h2>
                <p className="text-xs">System health and recent incidents for connected cabinets only.</p>
            </div>
            {data?.smartCabinets ?
                (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="pt-5 pb-1 px-3.5 rounded-[10px] bg-background">
                            <div className="flex justify-between mb-3">
                                <h6 className="text-sm font-semibold leading-[1] m-0">System Health</h6>
                                <Link to="/cabinets/tracking" className='text-foreground hover:text-primary text-xs'>View details</Link>
                            </div>
                            <div>
                                {systemHealthData(data).map((activity: SystemHelthDefination) => {
                                    const Icon = activity.icon;
                                    return (
                                    <div key={activity.id} className="group text-xs border-b border-[#E9E9E9] last:border-b-0">
                                        <Link to="/cabinets/tracking" className="block py-2.5 pr-2.5">
                                            <div className="flex items-center gap-1.25">
                                                {Icon ? <span className={cn("flex-shrink-0 size-6 flex items-center justify-center bg-card-error text-error rounded", {
                                                    "bg-card-success text-success": activity.count === 0
                                                })}>
                                                    <Icon className="size-3.5" />
                                                </span> : null}
                                                <span className="w-0 grow text-accent-foreground"> <span className="font-semibold">{activity.count}</span> {activity.activity}</span>
                                                <ChevronRight size={18} />
                                            </div>
                                        </Link>
                                    </div>
                                )
                                })}
                            </div>
                        </div>
                        <div className="pt-5 pb-1 px-3.5 rounded-[10px] bg-background">
                            <div className="flex justify-between mb-3">
                                <h6 className="text-sm font-semibold leading-[1] m-0">Recent Events</h6>
                                <Link to="/cabinets/tracking?tabs=Events" className='text-foreground hover:text-primary text-xs'>View all</Link>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <tbody>
                                    {events?.map((event: CabinetEventRow, i) => {
                                        return (
                                        <tr key={i} className="group text-xs">
                                            <td className="py-2">
                                                <div className="flex items-center gap-2 text-accent-foreground">
                                                    <span className='h-1 w-1 rounded-full bg-primary'></span>
                                                    {/* <span>{new Date(event?.time).toLocaleTimeString([], {
                                                        hour: "2-digit",
                                                        minute: "2-digit",
                                                    })}</span> */}
                                                    <span>{formatMonDayTime(event.time)}</span>
                                                </div>
                                            </td>
                                            <td className="py-2 [&_svg]:size-4 px-3 xl:px-4">
                                                {switchIcon(event.event)}
                                            </td>
                                            <td className="py-2">
                                                <h6 className="font-normal m-0 leading-[1.3] capitalize">{event.event}</h6>
                                                <span className="block leading-[1.3] text-[10px]">{event.cabinetName}</span>
                                            </td>
                                        </tr>
                                    )
                                    }).slice(0,5)}
                                    {isFetching && !isRefetching && 
                                        <div className="grid grid-cols-1 gap-2">
                                            <Skeleton className="w-full bg-white h-9 rounded" />
                                            <Skeleton className="w-full bg-white h-9 rounded" />
                                            <Skeleton className="w-full bg-white h-9 rounded" />
                                            <Skeleton className="w-full bg-white h-9 rounded" />
                                            <Skeleton className="w-full bg-white h-9 rounded" />
                                        </div>
                                    }
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
                : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                        <div className="p-5 relative rounded-[15px] bg-background flex flex-col">
                            <img src={connectedCabinetsBg} className="pointer-events-none border rounded-[15px] w-full h-full object-cover absolute top-0 left-0" alt="" />
                            <div className="relative grow flex flex-col justify-center">
                                <div className="py-4 px-3 shadow-card bg-white rounded-[10px] text-center relative w-full">
                                    <div className="max-w-[230px] mx-auto">
                                        <div className="flex justify-center mb-2.5">
                                            <Icons.lock />
                                        </div>
                                        <h4 className="mb-2 text-sm font-semibold">
                                            System health requires
                                            <br />
                                            connected cabinets
                                        </h4>
                                        <p className="text-xs mb-3">
                                            Upgrade to access real-time connectivity
                                            and cabinet monitoring.
                                        </p>
                                        <Link to="/explore-upgrade">
                                            <button type="button" className="text-primary-light rounded-full bg-white shadow-card px-6 text-xs h-9">
                                                Explore upgrade
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="p-5 relative rounded-[15px] bg-background flex flex-col">
                            <img src={connectedCabinetsBg} className="pointer-events-none border rounded-[15px] w-full h-full object-cover absolute top-0 left-0" alt="" />
                            <div className="relative grow flex flex-col justify-center">
                                <div className="py-4 px-3 shadow-card bg-white rounded-[10px] text-center relative w-full">
                                    <div className="max-w-[230px] mx-auto">
                                        <div className="flex justify-center mb-2.5">
                                            <Icons.lock />
                                        </div>
                                        <h4 className="mb-2 text-sm font-semibold">
                                            Live activity requires
                                            <br />
                                            connected cabinets
                                        </h4>
                                        <p className="text-xs mb-3">
                                            Upgrade your cabinets to view real-time
                                            events, alerts and status updates.
                                        </p>
                                        <Link to="/explore-upgrade">
                                            <button type="button" className="text-primary-light rounded-full bg-white shadow-card px-6 text-xs h-9">
                                                Explore upgrade
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

        </div>  
    );
}
