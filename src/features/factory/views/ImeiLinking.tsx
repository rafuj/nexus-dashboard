import { Helmet } from "react-helmet-async";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip"
import { Check, RotateCcw, Search } from "lucide-react";
import BoxIcons from "@/assets/icons/box-icons.svg?react"
import CheckIcon from "@/assets/icons/check.svg?react"
import { cn } from "@/lib/utils";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { Input } from "@/shared/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type PaginationState } from "@tanstack/react-table";
import { factoryColumns } from "../components/factoryColumns";
import { useFactoryLogs } from "../hooks/useFactoryLogs";
import { useDeviceInstallations } from "../hooks/useDeviceInstallations";
import { getApiErrorMessage } from "@/app/api-manage/api";
import { errorToast, successToast } from "@/lib/toast";
import { imeiRegex, nexRegex, updRegex } from "@/features/cabinets/types/cabinet";
import { parseAsStringEnum, useQueryState } from "nuqs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { useDeviceReserve } from "../hooks/useDeviceReserve";
import { useDeviceImeiLink } from "../hooks/useDeviceImeiLink";
import { queryImeiLinkingPage } from "../server/queryImeiLinkingPage";

const PAGE_SIZE = 10;

export default function ImeiLinking() {

  const combinationsTypeList = [
    {
      id: "connected-nexus",
      name: "Connected Nexus",
    },
    {
      id: "non-connected-nexus",
      name: "Non-connected Nexus",
    },
    {
      id: "separate-module",
      name: "Separate Module",
    },
  ] as const

  const moduleModelList = [
    {
      id: "connected-v1",
      name: "Connected V1",
    },
    {
      id: "non-connected-v1",
      name: "Non-connected V1",
    },
  ] as const

  type CombinationsType = (typeof combinationsTypeList)[number]["id"]
  type ModuleValueType = (typeof moduleModelList)[number]["id"]

  const tabValues = combinationsTypeList.map(
    (tab) => tab.id
  ) as CombinationsType[]
  const moduleValues = moduleModelList.map(
    (tab) => tab.id
  ) as ModuleValueType[]

  const [combinationsType, setCombinationsType] = useQueryState(
    "combinations",
    parseAsStringEnum(tabValues).withDefault("connected-nexus")
  )
  const [moduleModel, setModuleModel] = useQueryState(
    "module",
    parseAsStringEnum(moduleValues).withDefault(moduleModelList[0].id)
  )

  const [search, setSearch] = useState<string>("");
  const [filterCombination, setFilterCombination] = useState<string>("all");

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const columns = useMemo(() => factoryColumns(), []);

  const { data } = useFactoryLogs()

  const resetPage = () =>
  setPagination((p) => ({
    ...p,
    pageIndex: 0,
  }));

  const pageResult = useMemo(
    () =>
      queryImeiLinkingPage({
        search,
        pageIndex: pagination.pageIndex,
        pageSize: pagination.pageSize,
        data: data?.units || [],
        combination: filterCombination
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      filterCombination,
      data
    ],
  );

  const table = useReactTable({
    data: pageResult.rows,
    columns,
    rowCount: pageResult.totalCount,
    manualPagination: true,
    enableSorting: false,
    autoResetPageIndex: false,
    getRowId: (row) => row.scannedAt,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    state: {
      pagination
    },
  });

  const [scanCount, setScanCount] = useState(0);

  const [scannedDevices, setScannedDevices] = useState<
    {
      imei: string
      cabinetSerialNumber: string
      deviceSerialNumber: string
    }[]
  >([]);

  const [imeiScanSuccess, setImeiScanSuccess] = useState<boolean>(false)
  const [serialScanSuccess, setSerialScanSuccess] = useState<boolean>(false)
  const [deviceScanSuccess, setDeviceScanSuccess] = useState<boolean>(false)
  const [linkedSuccess, setLinkedSuccess] = useState<boolean>(false)
  const [lastScan, setLastScan] = useState<{cabinetSerialNumber?:string,imei?:string,deviceSerialNumber?:string}>({})

  const deviceInstallations = useDeviceInstallations()
  const deviceReserve = useDeviceReserve()
  const deviceImeiLink = useDeviceImeiLink()

  const handleDeviceInstallations = async () => {
    if (!scannedDevices.length) return;
    const payload = {
      cabinetSerialNumber: scannedDevices[0]?.cabinetSerialNumber,
      deviceSerialNumber: scannedDevices[0]?.deviceSerialNumber,
      imei: scannedDevices[0]?.imei,
    };

    const onSuccess = (message?: string) => {
      setLastScan({
        cabinetSerialNumber: scannedDevices?.[0]?.cabinetSerialNumber ?? "",
        imei: scannedDevices?.[0]?.imei ?? "",
        deviceSerialNumber: scannedDevices?.[0]?.deviceSerialNumber ?? ""
      })
      setLinkedSuccess(true)
      successToast(message || "Devices installed successfully");
      setScanCount((prev) => prev + 1);
    }

    // Connected Nexus
    if(combinationsType === "connected-nexus") {
      if(updRegex.test(payload?.deviceSerialNumber) && nexRegex.test(payload?.cabinetSerialNumber) && imeiRegex.test(payload?.imei)) {
        try {
          await deviceInstallations.mutateAsync(payload);
          onSuccess()
        } catch (error) {
          errorToast(getApiErrorMessage(error));
          return
        }
      }
    }

    // Non Connected Nexus
    if(combinationsType === "non-connected-nexus") {
      if(updRegex.test(payload?.deviceSerialNumber) && nexRegex.test(payload?.cabinetSerialNumber)) {
        try {
          await deviceInstallations.mutateAsync({
            cabinetSerialNumber: payload?.cabinetSerialNumber,
            deviceSerialNumber: payload?.deviceSerialNumber,
          });
          onSuccess()
        } catch (error) {
          errorToast(getApiErrorMessage(error));
          return
        }
      }
    }
    
    // Seperated Module
    if(combinationsType === "separate-module") {
      if(moduleModel === "non-connected-v1") {
        if(updRegex.test(payload?.deviceSerialNumber)) {
          try {
            await deviceReserve.mutateAsync({
              serialNumber: payload?.deviceSerialNumber,
            })
            onSuccess()
          } catch (error) {
            errorToast(getApiErrorMessage(error));
            return
          }
        }
      }
      if(moduleModel === "connected-v1") {
        if(updRegex.test(payload?.deviceSerialNumber) && imeiRegex.test(payload?.imei)) {
          try {
            await deviceImeiLink.mutateAsync({
              serialNumber: payload?.deviceSerialNumber,
              imei: payload?.imei,
            })
            onSuccess()
          } catch (error) {
            errorToast(getApiErrorMessage(error));
            return
          }
        }
      }
    }

  };

  useEffect(() => {
    if(!linkedSuccess && (serialScanSuccess || imeiScanSuccess || deviceScanSuccess)) {
      handleDeviceInstallations()
    }
  }, [imeiScanSuccess, serialScanSuccess, deviceScanSuccess, combinationsType, moduleModel, scannedDevices])
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "cabinetSerialNumber" | "imei" | "deviceSerialNumber"
  ) => {
    let value = e.target.value.toUpperCase();
    setLinkedSuccess(false)

    if (field === "cabinetSerialNumber") {
      setSerialScanSuccess(false)
      // Remove existing hyphens
      value = value.replace(/-/g, "");

      // Allow only letters and numbers
      value = value.replace(/[^A-Z0-9]/g, "");

      // Maximum: 5 + 5 + 5 = 15 characters
      value = value.slice(0, 15);

      // Add hyphens automatically
      if (value.length > 10) {
        value = `${value.slice(0, 5)}-${value.slice(5, 10)}-${value.slice(10)}`;
      } else if (value.length > 5) {
        value = `${value.slice(0, 5)}-${value.slice(5)}`;
      } else if (value.length === 5) {
        value = `${value}-`;
      }
      if(nexRegex.test(value)) {
        setSerialScanSuccess(true);
      }
    }

    if (field === "deviceSerialNumber") {
      setDeviceScanSuccess(false)
      // Remove existing hyphens
      value = value.replace(/-/g, "");

      // Allow only letters and numbers
      value = value.replace(/[^A-Z0-9]/g, "");

      // Maximum: 5 + 5 + 5 = 15 characters
      value = value.slice(0, 15);

      // Add hyphens automatically
      if (value.length > 10) {
        value = `${value.slice(0, 5)}-${value.slice(5, 10)}-${value.slice(10)}`;
      } else if (value.length > 5) {
        value = `${value.slice(0, 5)}-${value.slice(5)}`;
      } else if (value.length === 5) {
        value = `${value}-`;
      }
      if(updRegex.test(value)) {
        setDeviceScanSuccess(true)
      }
    }

    if (field === "imei") {
      setImeiScanSuccess(false);
      // Only numbers + max 15 digits
      value = value.replace(/\D/g, "").slice(0, 15);

      if(imeiRegex.test(value)) {
        setImeiScanSuccess(true);
      }
    }

    setScannedDevices((prev) => [
      {
        ...(prev[0] ?? {
          cabinetSerialNumber: "",
          imei: "",
          deviceSerialNumber: ""
        }),
        [field]: value,
      },
    ]);

  };

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
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Linking</h1>
                <p className="text-xs lg:text-sm">
                  Link cabinet bodies, PCB enclosures and IMEI numbers.
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
            {/* Cabinet Serial Number */}
            <div className="bg-white border rounded-[10px] border-border py-5 px-4">
              <div className={cn("mb-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-[21fr_25fr_5fr] 2xl:grid-cols-[42fr_45fr_30fr] gap-3", {
                "xl:grid-cols-[3fr_3fr_4fr] 2xl:grid-cols-[3fr_3fr_4fr]": combinationsType === "separate-module"
              })}>
                <div>
                  <div className="text-xs font-medium text-accent-foreground mb-1.25">
                    <span>Combinations type</span>
                  </div>
                  <Select value={combinationsType} onValueChange={(value:CombinationsType) => {
                    setCombinationsType(value)
                    setModuleModel(moduleModelList[0].id)
                    if(linkedSuccess) {
                      setLinkedSuccess(false)
                      setScannedDevices([])
                    }
                  }}>
                    <SelectTrigger className="w-full !h-9">
                      <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                        <span className="line-clamp-1 w-0 grow text-left"><SelectValue /></span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {combinationsTypeList.map((combination) => (
                        <SelectItem key={combination.id} value={combination.id}>
                          {combination.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                {combinationsType === "separate-module" && (
                  <div>
                    <div className="text-xs font-medium text-accent-foreground mb-1.25">
                      <span>Module model</span>
                    </div>
                    <Select value={moduleModel} onValueChange={(value:ModuleValueType) => {
                      setModuleModel(value);
                      if(value === "non-connected-v1") {
                        setScannedDevices(prev => ([{
                          ...prev[0],
                          imei: ""
                        }]))
                      }
                      if(linkedSuccess) {
                        setLinkedSuccess(false)
                        setScannedDevices([])
                      }
                    }}>
                      <SelectTrigger className="w-full !h-9">
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        {moduleModelList.map((moduleModel) => (
                          <SelectItem key={moduleModel.id} value={moduleModel.id}>
                            {moduleModel.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
                <div className={cn("flex", {
                  "max-xl:col-span-2 max-sm:col-span-1": combinationsType === "separate-module"
                })}>
                  <div className="card-info px-4 py-5 text-[13px] rounded-[10px] w-full xl:w-auto max-w-full">
                    {combinationsType === "connected-nexus" && "Links a Nexus cabinet body to its PCB enclosure and connected IMEI."}
                    {combinationsType === "non-connected-nexus" && "Links a Nexus cabinet body to its PCB enclosure without an IMEI."}
                    {combinationsType === "separate-module" && "Links a standalone PCB enclosure to the IMEI of its connected PCB."}
                  </div>
                </div>
              </div>
              <div className={cn("grid grid-cols-1 md:grid-cols-2 gap-5", {
                "md:grid-cols-3": combinationsType === "connected-nexus"
              })}>
                {/* NEX CODE */}
                {combinationsType !== "separate-module" && (
                  <div>
                    <div className="text-xs font-medium text-accent-foreground mb-2.5">
                      Scan NEX code
                    </div>
                    <div className="relative">
                      <BoxIcons className="text-success2 absolute top-1/2 -translate-y-1/2 left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        className="h-[58px] w-full border card-success2 pl-11.5 pr-4 py-5 rounded-[10px] outline-0 text-[17px] text-accent-foreground font-semibold"
                        value={scannedDevices?.[0]?.cabinetSerialNumber ?? ""}
                        onChange={(e) => handleChange(e, "cabinetSerialNumber")}
                        placeholder="e.g. NEX26-00001-00043"
                        disabled={deviceInstallations.isPending}
                      />
                    </div>
                    {serialScanSuccess &&(<div className="text-xs font-semibold flex items-center justify-end text-success2 gap-1 mt-2.5">
                      <span>Scanned successfully</span>
                      <Check size={14} />
                    </div>)}
                  </div>
                )}
                {/* UPD CODE */}
                <div>
                  <div className="text-xs font-medium text-accent-foreground mb-2.5">
                    Scan UPD code
                  </div>
                  <div className="relative">
                    <BoxIcons className="text-success2 absolute top-1/2 -translate-y-1/2 left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      className="h-[58px] w-full border card-success2 pl-11.5 pr-4 py-5 rounded-[10px] outline-0 text-[17px] text-accent-foreground font-semibold"
                      value={scannedDevices?.[0]?.deviceSerialNumber ?? ""}
                      onChange={(e) => handleChange(e, "deviceSerialNumber")}
                      placeholder="e.g. UPD26-00001-00183"
                      disabled={deviceInstallations.isPending}
                    />
                  </div>
                  {deviceScanSuccess &&(<div className="text-xs font-semibold flex items-center justify-end text-success2 gap-1 mt-2.5">
                    <span>Scanned successfully</span>
                    <Check size={14} />
                  </div>)}
                </div>
                {/* IMEI number */}
                {combinationsType !== "non-connected-nexus" && (
                  <div>
                    <div className="text-xs font-medium text-accent-foreground mb-2.5">
                      Scan IMEI number
                    </div>
                    <div className="relative">
                      <BoxIcons className={cn("text-success2 absolute top-1/2 -translate-y-1/2 left-3.5 pointer-events-none", {
                        "text-foreground":moduleModel === "non-connected-v1"
                      })} />
                      <input
                        type="text"
                        className={cn("h-[58px] w-full border card-success2 pl-11.5 pr-4 py-5 rounded-[10px] outline-0 text-[17px] text-accent-foreground font-semibold", {
                          "bg-[#F5F6F9] border-[#D9DBE5]": moduleModel === "non-connected-v1"
                        })}
                        value={scannedDevices?.[0]?.imei ?? ""}
                        onChange={(e) => handleChange(e, "imei")}
                        placeholder={moduleModel === "non-connected-v1" ? "Not applicable to this module model" : "e.g. 847394728949384"}
                        disabled={deviceInstallations.isPending || moduleModel === "non-connected-v1"}
                      />
                    </div>
                    {moduleModel === "non-connected-v1" && <span className="text-[11px] text-xs font-semibold text-end block mt-1.5">Disabled — no IMEI scan required</span>}
                    {moduleModel === "connected-v1" && imeiScanSuccess && (
                      <div className="text-xs font-semibold flex items-center justify-end text-success2 gap-1 mt-2.5">
                        <span>Scanned successfully</span>
                        <Check size={14} />
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* Linked Successfully */}
              {linkedSuccess &&
                <div className={cn("mt-4")}>
                  <div className="py-4 px-2.75 card-success2 border rounded-[10px] flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5">
                      <div className="size-12.5 rounded-full bg-success2 text-white flex justify-center items-center shrink-0">
                        <CheckIcon />
                      </div>
                      <div className="text-success2">
                        <h6 className="font-semibold text-success2">
                          {combinationsType === "connected-nexus" && "Successfully linked Connected Nexus"}
                          {combinationsType === "non-connected-nexus" && "Successfully linked Non-connected Nexus"}
                          {combinationsType === "separate-module" && (moduleModel === "connected-v1" ? "Successfully linked Connected V1 module" : "Successfully registered Non-connected V1 module")}
                        </h6>
                        <div className="text-sm">
                          {combinationsType === "connected-nexus" && `${lastScan.cabinetSerialNumber} ↔ ${lastScan.deviceSerialNumber} ↔ IMEI ${lastScan.imei}`}
                          {combinationsType === "non-connected-nexus" && `${lastScan.cabinetSerialNumber} ↔ ${lastScan.deviceSerialNumber}`}
                          {combinationsType === "separate-module" && (moduleModel === "connected-v1" ? `${lastScan.deviceSerialNumber} ↔ IMEI ${lastScan.imei}` : `${lastScan.deviceSerialNumber} marked as used • No IMEI required`)}
                        </div>
                      </div>
                    </div>
                    <button type="button" className="bg-white flex items-center gap-1.5 text-accent-foreground py-3.75 px-5 rounded-full text-sm" onClick={()=> {
                      setScannedDevices([])
                      setImeiScanSuccess(false)
                      setSerialScanSuccess(false)
                      setDeviceScanSuccess(false)
                      setLinkedSuccess(false)
                    }}>
                      <BoxIcons className="size-5" />
                      <span>Ready for next scan</span>
                    </button>
                  </div>
                </div>
              }
              {(deviceInstallations.isPending) && <div className={cn("text-center text-xl text-accent-foreground py-10")}> <span className="animate-spin"></span>Linking device ...</div> }
              <div className={cn("flex flex-wrap gap-2.5 mt-5")}>
                <div className="border border-border rounded-[10px] text-sm px-5 py-2.75 text-accent-foreground">
                  Linked this session: <span className="font-semibold">{scanCount}</span>
                </div>
                <button type="button" className="flex items-center justify-center gap-1.25 text-accent-foreground text-xs bg-chip h-11 px-5 xl:px-6 rounded-full xl:min-w-[192px]" onClick={()=> setScanCount(0)}>
                  <RotateCcw size={16} />
                  <span>Reset Counter</span>
                </button>
                <div className="flex items-center gap-2 text-[11px] font-semibold shrink-0">
                  <span className="text-accent-foreground">Scanner Status:</span>
                  <span className="text-success2 flex items-center gap-1.5">
                    <span className="size-2 rounded-full inline-block bg-success2"></span>
                    Connected
                  </span>
                </div>
              </div>
            </div>
            <div
                className={cn(
                  "bg-white border rounded-[10px] border-border py-5 px-4",
                )}
              >
                <div className="flex flex-col xl:flex-row gap-3 xl:gap-5 mb-4 pb-4 border-b items-start">
                  <div className="max-w-[310px] w-full">
                    <h6 className="font-semibold text-base">Recently Linked</h6>
                    <div className="text-sm">View linked ({`<`}30 days) cabinet bodies, PCB enclosures and IMEI numbers.</div>
                  </div>
                  <div className="flex flex-wrap md:flex-nowrap justify-end gap-2 md:gap-5 grow">
                    <div className="grow md:max-w-90">
                      <Select value={filterCombination} onValueChange={(value:CombinationsType) => setFilterCombination(value)}>
                        <SelectTrigger className="w-full h-10 md:!h-12.5">
                          <div className="flex items-center gap-1 font-medium text-accent-foreground w-full text-xs">
                            <span>Combination:</span>
                            <span className="line-clamp-1 text-left"><SelectValue prefix="Combination" /></span>
                          </div>
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="Connected Nexus">Connected Nexus</SelectItem>
                            <SelectItem value="Non-connected Nexus">Non-connected Nexus</SelectItem>
                            <SelectItem value="Separate module">Separate module</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="relative max-md:grow">
                      <Search
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                        aria-hidden
                      />
                      <Input
                        placeholder="Search NEX, UPD or IMEI..."
                        value={search}
                        onChange={(e) => {
                          resetPage()
                          setSearch(e.target.value)
                        }}
                        className="pl-9 h-10 border border-border bg-white md:!h-12.5 min-w-[236px] lg:min-w-[304px]"
                        autoComplete="off"
                      />
                    </div>
                  </div>
                </div>
                <DataTable
                  table={table}
                  emptyMessage="No cabinets match your filters."
                  tableClassName="text-accent-foreground"
                />
                <div className="border-border border-t pt-4">
                  <DataTablePagination
                    table={table}
                    navLabel="IMEI Links"
                    resultSuffix="links"
                  />
                </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
