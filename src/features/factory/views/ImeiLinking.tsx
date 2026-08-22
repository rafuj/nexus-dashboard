import { Helmet } from "react-helmet-async";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip"
import { InfoIcon, RotateCcw, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/shared/components/ui/tooltip"
import BoxIcons from "@/assets/icons/box-icons.svg?react"
import CheckCircleIcon from "@/assets/icons/check-circle.svg?react"
import CheckIcon from "@/assets/icons/check.svg?react"
import { cn } from "@/lib/utils";
import { DataTable, DataTablePagination } from "@/shared/components/data-table";
import { Input } from "@/shared/components/ui/input";
import { useEffect, useMemo, useState } from "react";
import { getCoreRowModel, useReactTable, type PaginationState, type SortingState } from "@tanstack/react-table";
import { factoryColumns } from "../components/factoryColumns";
import { queryImeiLinkingPage } from "../server/queryImeiLinkingPage";
import { useGeneratedSerialList } from "../hooks/useGeneratedSerialList";
import { useCreateDevices } from "../hooks/useCreateDevices";
import { useDeviceInstallations } from "../hooks/useDeviceInstallations";
import { getApiErrorMessage } from "@/app/api-manage/api";
import { errorToast, successToast } from "@/lib/toast";

const PAGE_SIZE = 10;

export default function ImeiLinking() {
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<SortingState>([]);

  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: PAGE_SIZE,
  });

  const columns = useMemo(() => factoryColumns(), []);

  const { data } = useGeneratedSerialList()

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
        sorting,
        data: data || []
      }),
    [
      search,
      pagination.pageIndex,
      pagination.pageSize,
      sorting,
      data
    ],
  );

  const table = useReactTable({
    data: pageResult.rows,
    columns,
    rowCount: pageResult.totalCount,
    manualPagination: true,
    manualSorting: true,
    autoResetPageIndex: false,
    getRowId: (row) => row.id,
    getCoreRowModel: getCoreRowModel(),
    onPaginationChange: setPagination,
    onSortingChange: (updater) => {
      setSorting(updater);
      resetPage();
    },
    state: {
      pagination,
      sorting,
    },
  });


  
  const [scanCount, setScanCount] = useState(0);

  const [scannedDevices, setScannedDevices] = useState<
    {
      imei: string;
      serialNumber: string;
    }[]
  >([]);

  const [imeiScanSuccess, setImeiScanSuccess] = useState<boolean>(false)
  const [serialScanSuccess, setSerialScanSuccess] = useState<boolean>(false)
  const [linkedSuccess, setLinkedSuccess] = useState<boolean>(false)
  const [lastScan, setLastScan] = useState<{serialNumber?:string,imei?:string}>({})

  const handleScanSuccess = ({
    imei,
    serialNumber,
  }: {
    imei: string;
    serialNumber: string;
  }) => {
    // Prevent duplicate scan
    const alreadyScanned = scannedDevices.some(
      (device) =>
        device.imei === imei ||
        device.serialNumber === serialNumber
    );

    if (alreadyScanned) {
      errorToast("This device has already been scanned");
      return;
    }

    setScannedDevices((prev) => [
      ...prev,
      { imei, serialNumber },
    ]);

    setScanCount((prev) => prev + 1);
  };

  const createDevices = useCreateDevices();
  const deviceInstallations = useDeviceInstallations();

  const handleDeviceInstallations = async () => {
    if (!scannedDevices.length) return;

    try {
      const devicePayload = {
        imeis: scannedDevices.map((device) => device.imei),
        model: "NEXUS V4.4",
      };
      setLastScan({
        serialNumber: scannedDevices?.[0]?.serialNumber ?? "",
        imei: scannedDevices?.[0]?.imei ?? ""
      })

      const installationPayload = {
        installations: scannedDevices,
      };

      await createDevices.mutateAsync(devicePayload);

      await deviceInstallations.mutateAsync(installationPayload);

      setLinkedSuccess(true)

      successToast("Devices installed successfully");

    } catch (error) {
      errorToast(getApiErrorMessage(error));
    }
  };

  useEffect(() => {
    if(imeiScanSuccess && serialScanSuccess){
      handleDeviceInstallations()
    }
  }, [imeiScanSuccess, serialScanSuccess])
  

  
  const imeiRegex = /^\d{15}$/;
  const serialRegex = /^NEX-[A-Z0-9]{5}-[A-Z0-9]{4}$/;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: "serialNumber" | "imei"
  ) => {
    let value = e.target.value.toUpperCase();

    if (field === "serialNumber") {
      setSerialScanSuccess(false);
    } else {
      setImeiScanSuccess(false);
    }

    if (field === "serialNumber") {
      // Remove existing hyphens
      value = value.replace(/-/g, "");

      // Allow only letters and numbers
      value = value.replace(/[^A-Z0-9]/g, "");

      // Maximum: 3 + 5 + 4 = 12 characters
      value = value.slice(0, 12);

      // Add hyphens automatically
      if (value.length > 8) {
        value = `${value.slice(0, 3)}-${value.slice(3, 8)}-${value.slice(8)}`;
      } else if (value.length > 3) {
        value = `${value.slice(0, 3)}-${value.slice(3)}`;
      } else if (value.length === 3) {
        value = `${value}-`;
      }
      if(serialRegex.test(value)) {
        setSerialScanSuccess(true);
      }
    }

    if (field === "imei") {
      // Only numbers + max 15 digits
      value = value.replace(/\D/g, "").slice(0, 15);

      if(imeiRegex.test(value)) {
        setImeiScanSuccess(true);
      }
    }

    setScannedDevices((prev) => [
      {
        ...(prev[0] ?? {
          serialNumber: "",
          imei: "",
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
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">IMEI</h1>
                <p className="text-xs lg:text-sm">
                  Scan the cabinet serial code and IMEI to link them automatically.
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
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Cabinet Serial */}
                <div>
                  <div className="text-xs font-medium flex items-center gap-1 text-accent-foreground mb-2.5">
                    <span>Cabinet Serial Number</span>
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
                  <div className="relative">
                    <BoxIcons className="text-success2 absolute top-1/2 -translate-y-1/2 left-4.5 pointer-events-none" />
                    <input
                      type="text"
                      className="h-[70px] lg:h-[82px] w-full border card-success2 pl-17 pr-4 py-5 rounded-[10px] outline-0 text-xl lg:text-2xl text-accent-foreground font-semibold"
                      value={scannedDevices?.[0]?.serialNumber ?? ""}
                      onChange={(e) => handleChange(e, "serialNumber")}
                      placeholder="e.g. NEX-JLFTM-C2VK"
                      disabled={deviceInstallations.isPending || createDevices.isPending}
                    />
                  </div>
                  {serialScanSuccess &&(<div className="text-xs font-semibold flex items-center justify-end text-success2 gap-1 mt-2.5">
                    <span>Scanned successfully</span>
                    <CheckCircleIcon />
                  </div>)}
                </div>
                {/* IMEI Number */}
                <div>
                  <div className="text-xs font-medium flex items-center gap-1 text-accent-foreground mb-2.5">
                    <span>IMEI Number</span>
                    <Tooltip>
                      <TooltipTrigger>
                        <span className={""}>
                          <InfoIcon size={16} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent side="right" className={""}>
                        IMEI Number - 847394728949384
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <div className="relative">
                    <BoxIcons className="text-success2 absolute top-1/2 -translate-y-1/2 left-4.5 pointer-events-none" />
                    <input
                      type="text"
                      className="h-[70px] lg:h-[82px] w-full border card-success2 pl-17 pr-4 py-5 rounded-[10px] outline-0 text-xl lg:text-2xl text-accent-foreground font-semibold"
                      value={scannedDevices?.[0]?.imei ?? ""}
                      onChange={(e) => handleChange(e, "imei")}
                      placeholder="e.g. 847394728949384"
                      disabled={deviceInstallations.isPending || createDevices.isPending}
                    />
                  </div>
                  {imeiScanSuccess &&(
                    <div className="text-xs font-semibold flex items-center justify-end text-success2 gap-1 mt-2.5">
                      <span>Scanned successfully</span>
                      <CheckCircleIcon />
                    </div>
                  )}
                </div>
                {/* Linked Successfully */}
                {linkedSuccess &&
                  <div className="md:col-span-2">
                    <div className="py-4 px-2.75 card-success2 border rounded-[10px] flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-2.5">
                        <div className="size-12.5 rounded-full bg-success2 text-white flex justify-center items-center shrink-0">
                          <CheckIcon />
                        </div>
                        <div className="text-success2">
                          <h6 className="font-semibold text-success2">Linked successfully</h6>
                          <div className="text-sm">
                            Cabinet serial <span className="font-bold">{lastScan.serialNumber}</span> has been linked to IMEI <span className="font-bold">{lastScan.imei}.</span>
                          </div>
                        </div>
                      </div>
                      <button type="button" className="bg-white flex items-center gap-1.5 text-accent-foreground py-3.75 px-5 rounded-full text-sm" onClick={()=> {
                        setScannedDevices([
                          {
                            imei:"",
                            serialNumber:""
                          }
                        ])
                        setImeiScanSuccess(false)
                        setSerialScanSuccess(false)
                        setLinkedSuccess(false)
                      }}>
                        <BoxIcons className="size-5" />
                        <span>Ready for next scan</span>
                      </button>
                    </div>
                    <div className="flex justify-end items-center text-xs font-semibold text-accent-foreground gap-2.5 mt-2.5">
                      Scanner Status:
                      <span className="flex items-center gap-1.25 text-success2"><span className="size-2.5 bg-success2 rounded-full"></span> Connected</span>
                    </div>
                    <div className="mt-3.75 flex flex-wrap gap-2.5">
                      <div className="grow border border-border rounded-[10px] text-base px-5 py-3 text-accent-foreground">
                        Counter: <span className="font-semibold">{scanCount}</span>
                      </div>
                      <button type="button" className="flex items-center gap-1.25 text-accent-foreground text-sm bg-chip h-12.5 px-5 xl:px-6 rounded-full">
                        <RotateCcw size={16} />
                        <span>Reset Counter</span>
                      </button>
                    </div>
                  </div>
                }
                {(deviceInstallations.isPending || createDevices.isPending) && <div className="md:col-span-2 text-center text-xl text-accent-foreground"> <span className="animate-spin"></span>Linking device ...</div> }
              </div>
            </div>
            <div
                className={cn(
                  "bg-white border rounded-[10px] border-border py-5 px-4",
                )}
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-4 pb-4 border-b">
                  <div>
                    <h6 className="font-semibold text-base">Recently Linked</h6>
                    <div className="text-sm">View recently linked IMEI numbers and cabinet serial numbers.</div>
                  </div>
                  <div>
                    <div className="relative max-w-[434px] ml-auto">
                      <Search
                        className="text-muted-foreground pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2"
                        aria-hidden
                      />
                      <Input
                        placeholder="Search serial number or IMEI..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="pl-9 h-10 border border-border bg-white md:!h-12.5"
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
                    navLabel="Cabinets table pagination"
                  />
                </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
