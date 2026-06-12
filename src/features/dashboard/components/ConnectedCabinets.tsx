import { User } from 'lucide-react';
import { Icons } from '@/app/icons/icons';
import connectedCabinetsBg from "@/assets/connected-cabinets-bg.png"
import { HAS_CONNECTED_CABINETS, responders } from "../mock/mockDashboardStats";

export default function ConnectedCabinets() {
    const renderRoleIcon = (type: string) => {
        switch (type) {
            case 'viewer':
                return <Icons.eye />;
            case 'editor':
                return <Icons.edit />;
            case 'admin':
                return <Icons.sheild />;
            default:
                return null;
        }
    };
    return (
        <div className="p-5 relative border rounded-[15px] bg-white">
            <div className="mb-4">
                <h2 className="text-sm mb-1.5 font-semibold">Connected Cabinets (240)</h2>
                <p className="text-xs">System health and activity for connected cabinets only.</p>
            </div>
            {HAS_CONNECTED_CABINETS ?
                (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            {/* Table Header */}
                            <thead>
                                <tr className="bg-muted">
                                    <th className="py-2.75 px-5 text-secondary-foreground font-semibold text-[12px] tracking-wide w-1/2 rounded-l-xl">
                                        Responder Overview
                                    </th>
                                    <th className="py-2.75 px-5 text-secondary-foreground font-semibold text-[12px] tracking-wide w-1/4">
                                        Role
                                    </th>
                                    <th className="py-2.75 px-5 text-secondary-foreground font-semibold text-[12px] tracking-wide w-1/4 text-right pr-12 rounded-r-xl">
                                        Notification
                                    </th>
                                </tr>
                            </thead>

                            {/* Table Body */}
                            <tbody className="divide-y divide-border">
                                {responders.map((responder, index) => (
                                    <tr key={index}>
                                        {/* User Identity */}
                                        <td className="py-3 px-5 flex items-center gap-3">
                                            {responder.avatar ? (
                                                <img
                                                    className="w-7 h-7 rounded-full object-cover"
                                                    src={responder.avatar}
                                                    alt={responder.name}
                                                />
                                            ) : (
                                                <div className="w-8 h-8 rounded-full bg-chip flex items-center justify-center text-muted-foreground">
                                                    <User className="w-4 h-4" />
                                                </div>
                                            )}
                                            <span className="text-secondary-foreground font-medium text-[12px]">
                                                {responder.name}
                                            </span>
                                        </td>

                                        {/* Role */}
                                        <td className="py-3 px-5">
                                            <div className="flex items-center gap-2 text-secondary-foreground text-[12px]">
                                                {renderRoleIcon(responder.roleType)}
                                                <span>{responder.role}</span>
                                            </div>
                                        </td>

                                        {/* Notifications */}
                                        <td className="py-3 px-5">
                                            <div className="flex items-center justify-end gap-4 pr-6 text-secondary-foreground">
                                                {responder.notifications.email && (
                                                    <button className="p-1 hover:bg-muted rounded transition-colors" aria-label="Email notification enabled">
                                                        <Icons.mail />
                                                    </button>
                                                )}
                                                {responder.notifications.chat && (
                                                    <button className="p-1 hover:bg-muted rounded transition-colors" aria-label="Chat notification enabled">
                                                        <Icons.messageSquare />
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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
                                        <button type="button" className="text-primary-light rounded-full bg-white shadow-card px-6 text-xs h-9">
                                            Explore upgrade
                                        </button>
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
                                        <button type="button" className="text-primary-light rounded-full bg-white shadow-card px-6 text-xs h-9">
                                            Explore upgrade
                                        </button>
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
