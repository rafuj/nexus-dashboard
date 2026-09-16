import ConnectedIcon from "@/assets/icons/connected.svg?react";
import NonConnectedIcon from "@/assets/icons/non-connected.svg?react";
import SeperatedModulesIcon from "@/assets/icons/seperate-modules.svg?react";
import TotalAvailableIcon from "@/assets/icons/total-available.svg?react";

interface Props {
    tabs: "linked" | "available";
    data: {
        connectedNexus: string
        nonConnectedNexus: string
        seperatedModules: string
        totalAvailable: string
        availableNexus: string
        availableUPD: string
    }
}

export const FactoryInfoCards = ({tabs, data}: Props) => {
    return tabs === "linked" ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
                <div className="py-4 px-3 rounded-[15px] card-info border flex items-center gap-2.5">
                    <div className="rounded-full bg-info text-white size-12.5 flex items-center justify-center">
                        <ConnectedIcon />
                    </div>
                    <div className="w-0 grow">
                        <h5 className="font-semibold text-accent-primary">{data.connectedNexus}</h5>
                        <div className="text-sm">Connected Nexus</div>
                    </div>
                </div>
            </div>
            <div>
                <div className="py-4 px-3 rounded-[15px] card-success2 border flex items-center gap-2.5">
                    <div className="rounded-full bg-success2 text-white size-12.5 flex items-center justify-center">
                        <NonConnectedIcon />
                    </div>
                    <div className="w-0 grow">
                        <h5 className="font-semibold text-accent-primary">{data.nonConnectedNexus}</h5>
                        <div className="text-sm">Non-connected Nexus</div>
                    </div>
                </div>
            </div>
            <div>
                <div className="py-4 px-3 rounded-[15px] card-warning border flex items-center gap-2.5">
                    <div className="rounded-full bg-warning text-white size-12.5 flex items-center justify-center">
                        <SeperatedModulesIcon />
                    </div>
                    <div className="w-0 grow">
                        <h5 className="font-semibold text-accent-primary">{data.seperatedModules}</h5>
                        <div className="text-sm">Separate modules</div>
                    </div>
                </div>
            </div>
        </div>
    ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
                <div className="py-4 px-3 rounded-[15px] card-info border flex items-center gap-2.5">
                    <div className="rounded-full bg-info text-white size-12.5 flex items-center justify-center">
                        <TotalAvailableIcon />
                    </div>
                    <div className="w-0 grow">
                        <h5 className="font-semibold text-accent-primary">{data.totalAvailable}</h5>
                        <div className="text-sm">Total Available</div>
                    </div>
                </div>
            </div>
            <div>
                <div className="py-4 px-3 rounded-[15px] card-success2 border flex items-center gap-2.5">
                    <div className="rounded-full bg-success2 text-white size-12.5 flex items-center justify-center">
                        <NonConnectedIcon />
                    </div>
                    <div className="w-0 grow">
                        <h5 className="font-semibold text-accent-primary">{data.availableNexus}</h5>
                        <div className="text-sm">Available NEX</div>
                    </div>
                </div>
            </div>
            <div>
                <div className="py-4 px-3 rounded-[15px] card-warning border flex items-center gap-2.5">
                    <div className="rounded-full bg-warning text-white size-12.5 flex items-center justify-center">
                        <SeperatedModulesIcon />
                    </div>
                    <div className="w-0 grow">
                        <h5 className="font-semibold text-accent-primary">{data.availableUPD}</h5>
                        <div className="text-sm">Available UPD</div>
                    </div>
                </div>
            </div>
        </div>
    )
}