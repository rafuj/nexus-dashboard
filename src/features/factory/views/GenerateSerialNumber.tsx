import { Helmet } from "react-helmet-async";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip"
import { ChevronDown, InfoIcon, Settings } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Input } from "@/shared/components/ui/input";
import { Button } from "@/shared/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuTrigger } from "@/shared/components/ui/dropdown-menu";
import { SidebarMenuButton } from "@/shared/components/ui/sidebar";
import { Icons } from "@/app/icons/icons";
import { useState } from "react";
import { useGenerateSerial } from "../hooks/useGenerateSerial";
import { errorToast, successToast } from "@/lib/toast";
import { getApiErrorMessage } from "@/app/api-manage/api";

type ExportTo = "Excel" | "Csv";

export default function GenerateSerialNumber() {
  const [exportTo, setExportTo] = useState<ExportTo>("Excel")

  const [quantity, setQuantity] = useState<number|''>('')
  
  const generateSerialMutation = useGenerateSerial()

  const handleGenerate = async () =>{
    if(quantity) {
      try {
        await generateSerialMutation.mutateAsync({quantity})
        successToast(`Generated ${quantity} New Serial Number successfully`)
        setQuantity("")
      } catch (error) {
          errorToast(getApiErrorMessage(error));
      }
    } else {
      errorToast("Quantity is a required field")
    }
  }

  return (
    <>
      <Helmet>
        <title>IMEI Linking | Updaid</title>
      </Helmet>
      <main>
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-3 md:gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
              <div className="md:w-0 grow">
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Generate Serial Number</h1>
                <p className="text-xs lg:text-sm">
                  Generate a batch of unique cabinet serial numbers
                </p>
              </div>
              <div className="flex items-center max-sm:flex-wrap gap-2.5">
                <div className="max-sm:hidden">
                  <DateAndTimeChip />
                </div>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5">
          <div className="space-y-5">
            <div className="bg-white border rounded-[10px] border-border py-5 px-4">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                <div className="md:col-span-3">
                  <div className="grid sm:grid-cols-3 gap-3.75">
                    <div>
                      <div className="text-xs font-medium flex items-center gap-1 text-accent-foreground mb-3.5">
                        <span>Prefix</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className={""}>
                              <InfoIcon size={16} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right" className={""}>
                            Cabinet Serial Number NEX - 00125
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Select>
                        <SelectTrigger className="w-full !h-12.5">
                          <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="NEX" /></span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="NEX">NEX</SelectItem>
                          {/* <SelectItem value="UPD">UPD</SelectItem> */}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <div className="text-xs font-medium flex items-center gap-1 text-accent-foreground mb-3.5">
                        <span>Quantity</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className={""}>
                              <InfoIcon size={16} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right" className={""}>
                            Cabinet Serial Number NEX - 00125
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input type="number" className="h-12.5" value={quantity} 
                          onChange={(e) => {
                              const value = e.target.value;
                              if (value === "") {
                                setQuantity("");
                                return;
                              }
                              setQuantity(Math.min(Number(value), 500));
                          }}
                        placeholder="e.g. 10"
                      />
                    </div>
                    <div>
                      <div className="text-xs font-medium flex items-center gap-1 text-accent-foreground mb-3.5">
                        <span>Start with (optional)</span>
                        <Tooltip>
                          <TooltipTrigger>
                            <span className={""}>
                              <InfoIcon size={16} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent side="right" className={""}>
                            Cabinet Serial Number NEX - 00125
                          </TooltipContent>
                        </Tooltip>
                      </div>
                      <Input className="h-12.5" placeholder="e.g. 2026" />
                    </div>
                  </div>
                  <Button className="rounded-full px-5 xl:px-8 h-12.5 mt-5" onClick={handleGenerate}>Generate Serial Numbers</Button>
                </div>
                <div className="bg-background rounded-[10px] border text-base p-4 text-xs">
                  <div className="flex items-center gap-3.75">
                    <div className="size-10 shrink-0 bg-border rounded-full flex items-center justify-center">
                      <InfoIcon size={18} />
                    </div>
                    <span className="font-semibold text-accent-foreground">About serial number</span>
                  </div>
                  <div className="py-[14px]">
                    Each serial number is unique and cannot be changed once generated.
                  </div>
                  You can export the generated list to Excel for your records.
                </div>
              </div>
              <div className="mt-5 flex flex-wrap justify-between items-center gap-5 bg-background border border-border rounded-[10px] p-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 text-accent-foreground grow gap-5 ">
                  <div>
                    <div className="text-xs font-semibold mb-1">Last Generation</div>
                    <div className="text-sm md:text-base font-semibold">May 26, 2026 at 12:20</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-1">Quantity Generated</div>
                    <div className="text-sm md:text-base font-semibold">100</div>
                  </div>
                  <div>
                    <div className="text-xs font-semibold mb-1">Prefix</div>
                    <div className="text-sm md:text-base font-semibold">Nex</div>
                  </div>
                </div>
                <div className="flex items-center justify-center gap-3 min-w-[200px] border border-border rounded-full pl-5 pr-3 bg-white">
                  <button type="button" className="flex items-center gap-1 text-accent-foreground grow">
                    <Icons.export />
                    <div className="text-left text-sm leading-tight">
                      Export to {exportTo}
                    </div>
                  </button>
                  <div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <SidebarMenuButton
                          size="lg"
                          className="data-[state=open]:text-sidebar-accent-foreground cursor-pointer rounded-none !bg-transparent !ring-0"
                        >
                          <ChevronDown className="ml-auto size-4" />
                        </SidebarMenuButton>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent
                        className="w-(--radix-dropdown-menu-trigger-width) rounded-lg min-w-50"
                        side={"bottom"}
                        align="end"
                        sideOffset={4}
                      >
                        <DropdownMenuGroup>
                          <DropdownMenuItem className="text-foreground py-2" onClick={()=> setExportTo("Excel")}>
                            <Settings className="size-3" />
                            <span>Export to Excel</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-foreground py-2" onClick={()=> setExportTo("Csv")}>
                            <Settings className="size-3" />
                            <span>Export to CSV</span>
                          </DropdownMenuItem>
                        </DropdownMenuGroup>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
