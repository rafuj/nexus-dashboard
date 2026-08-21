import { Icons } from '@/app/icons/icons';
import connectedCabinetsBg from "@/assets/connected-cabinets-bg.png"
import { HAS_CONNECTED_CABINETS, recentActivityData, systemHealthData } from "../mock/mockDashboardStats";
import { Link } from 'react-router';
import type { ActivityDefination, SystemHelthDefination } from '../types/dashboardStats';

export default function ConnectedCabinets() {
    // const renderRoleIcon = (type: string) => {
    //     switch (type) {
    //         case 'viewer':
    //             return <Icons.eye />;
    //         case 'editor':
    //             return <Icons.edit />;
    //         case 'admin':
    //             return <Icons.sheild />;
    //         default:
    //             return null;
    //     }
    // };
    return (
        <div className="p-5 relative border rounded-[15px] bg-white">
            <div className="mb-4">
                <h2 className="text-sm mb-1.5 font-semibold">Connected Cabinets (240)</h2>
                <p className="text-xs">System health and activity for connected cabinets only.</p>
            </div>
            {HAS_CONNECTED_CABINETS ?
                (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div className="py-5 px-2.5 xl:pr-3.75 rounded-[10px] bg-background">
                            <div className="flex justify-between mb-3">
                                <h6 className="text-sm font-semibold leading-[1] m-0">System Health</h6>
                                <Link to="" className='text-foreground hover:text-primary text-xs'>View details</Link>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <tbody>
                                    {systemHealthData.map((activity: SystemHelthDefination) => {
                                        const Icon = activity.icon;
                                        return (
                                        <tr key={activity.id} className="group text-xs">
                                            <td className="py-2.5 group-last:pb-0">
                                                <div className="flex items-center gap-1.25">
                                                    {Icon ? <Icon /> : null}
                                                    <span>{activity.activity}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 group-last:pb-0 px-2 xl:px-3">
                                                <div className="flex gap-1">
                                                    <span>Yes:</span> <span className="font-semibold text-success">{activity.yes}</span>
                                                </div>
                                            </td>
                                            <td className="py-2.5 group-last:pb-0">
                                                <div className="flex justify-end gap-1">
                                                    <span>No:</span> <span className="font-semibold text-error">{activity.no}</span>
                                                </div>
                                            </td>
                                        </tr>
                                    )
                                    })}
                                </tbody>
                            </table>
                        </div>
                        <div className="py-5 px-2.5 xl:pr-3.75 rounded-[10px] bg-background">
                            <div className="flex justify-between mb-3">
                                <h6 className="text-sm font-semibold leading-[1] m-0">Recent Activity</h6>
                                <Link to="" className='text-foreground hover:text-primary text-xs'>View details</Link>
                            </div>
                            <table className="w-full text-left border-collapse">
                                <tbody>
                                    {recentActivityData.map((activity: ActivityDefination) => {
                                        const Icon = activity.icon;
                                        return (
                                        <tr key={activity.id} className="group text-xs">
                                            <td className="pb-4 group-last:pb-0">
                                                <div className="flex items-center gap-2 text-accent-foreground">
                                                    <span className='h-1 w-1 rounded-full bg-primary'></span>
                                                    <span>{activity.time}</span>
                                                </div>
                                            </td>
                                            <td className="pb-4 group-last:pb-0 px-2 xl:px-3">
                                                {Icon ? <Icon /> : null}
                                            </td>
                                            <td className="pb-4 group-last:pb-0">
                                                <h6 className="font-normal m-0 leading-[1.3]">{activity.action}</h6>
                                                <span className="block leading-[1.3]">{activity.location}</span>
                                            </td>
                                        </tr>
                                    )
                                    })}
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
