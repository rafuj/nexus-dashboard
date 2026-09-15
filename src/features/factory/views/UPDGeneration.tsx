import { Helmet } from "react-helmet-async";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip"
import { Input } from "@/shared/components/ui/input";
import { useState } from "react";
import { useGenerateSerial } from "../hooks/useGenerateSerial";
import { errorToast, successToast } from "@/lib/toast";
import { getApiErrorMessage } from "@/app/api-manage/api";
import { LoaderButton } from "@/app/components/loader-button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { Check } from "lucide-react";
import { Link } from "react-router";

export default function UPDGeneration() {

  const [quantity, setQuantity] = useState<number|''>('')
  const [isSuccess, setIsSuccess] = useState<boolean>(false)
  
  const currentYear = new Date().getFullYear();

  const productionYearsList = Array.from(
    { length: 22 },
    (_, i) => String(currentYear - 19 + i).slice(2)
  );

  const [productionYear, setProductionYear] = useState<string|''>(currentYear.toString().slice(2))
  
  const generateSerialMutation = useGenerateSerial()

  const handleGenerate = async () =>{
    if(quantity) {
      try {
        await generateSerialMutation.mutateAsync(
          {
            quantity,
            // year: productionYear,
            // prefix: "UPD",
          }
        )
        successToast(`Generated ${quantity} New Serial Number successfully`)
        setQuantity("")
        setIsSuccess(true)
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
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">UPD Generation</h1>
                <p className="text-xs lg:text-sm">
                  Generate model-bound serial numbers for separate Updaid modules.
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
          <div className="bg-white border rounded-[10px] border-border py-5 px-4">
            <div className="flex flex-wrap gap-4 mb-7">
              
              <div className="card-error rounded-[10px] border text-base p-4 text-xs w-full md:w-[260px]">
                <div className="flex items-center gap-3.75">
                  <span className="font-semibold text-[#A72822] text-sm">Available UPD serial numbers</span>
                </div>
                <h5 className="font-semibold text-[30px] leading-[1] mb-2 mt-1.75">163</h5>
                <div className="text-xs">
                  Generated but not yet assigned
                </div>
              </div>
              
              <div className="bg-background rounded-[10px] border text-base p-4 text-xs grow w-full md:w-0">
                <div className="flex items-center gap-3.75">
                  <span className="font-semibold text-accent-foreground text-sm">UPD module serials</span>
                </div>
                <div className="mt-2.5 mb-3.75">
                  Every generated UPD serial is bound to the selected hardware model. It does not create a cabinet record.
                </div>
                <span className="font-medium text-accent-foreground">Production year uses two digits and is entered manually.</span>
              </div>

            </div>
            <div>
              <div className="grid sm:grid-cols-3 gap-3.75">
                <div>
                  <div className="text-xs font-medium text-accent-foreground mb-3.5">
                    Prefix
                  </div>
                  <div className="relative">
                    <Input className="h-12.5 text-xs" value="UPD" readOnly />
                    <span className="absolute top-1/2 right-4 -translate-y-1/2 text-xs">Fixed</span>
                  </div>
                </div>
                <div>
                  <div className="text-xs font-medium text-accent-foreground mb-3.5">
                    <span>Production year (YY) <span>*</span></span>
                  </div>
                  <Select value={productionYear.toString()} onValueChange={(value) => setProductionYear(value)}>
                    <SelectTrigger className="w-full !h-12.5 [&_svg]:hidden">
                      <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                        <span className="line-clamp-1 w-0 grow text-left"><SelectValue /></span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {productionYearsList.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year.toString()}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-xs font-medium text-accent-foreground mb-3.5">
                    <span>Model <span>*</span></span>
                  </div>
                  <Select>
                    <SelectTrigger className="w-full !h-12.5">
                      <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                        <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select model" /></span>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="connected-v1">Connected V1</SelectItem>
                      <SelectItem value="non-connected-v1">Non Connected V1</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="text-xs font-medium text-accent-foreground mb-3.5">
                    Quantity <span>*</span>
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
                <div className="bg-background rounded-[10px] border text-base p-4 text-xs grow sm:col-span-2">
                  <div className="flex items-center gap-3.75">
                    <span className="font-semibold text-accent-foreground text-xs">Model required</span>
                  </div>
                  <div className="mt-1.75">Choose V1, V1.2, V2 or a later hardware version before generating.</div>
                </div>
              </div>
              <div className="card-info px-4 py-3.25 rounded-[10px] mt-5">
                <span className="font-medium text-[11px] mb-1.25">Serial format</span>
                <span className="text-base font-semibold block text-accent-foreground">UPD[YY]-[XXXX]-[XXXX]</span>
              </div>
              <div className="flex flex-wrap items-center gap-2 gap-x-5 mt-6">
                <LoaderButton loading={generateSerialMutation.isPending} className="rounded-full px-5 xl:px-8 h-12.5" onClick={handleGenerate}>Generate Serial Numbers</LoaderButton>
                <span className="text-[13px]">Generated serials will be assigned to model V1.2.</span>
              </div>

            {isSuccess && (
              <div className="py-5.5 px-4.5 card-success2 border rounded-[10px] flex flex-wrap items-center justify-between gap-3 mt-5">
                <div className="flex items-center gap-2.5">
                  <div className="size-12.5 rounded-full bg-success2 text-white flex justify-center items-center shrink-0">
                    <Check />
                  </div>
                  <div className="text-success2">
                    <h6 className="font-semibold text-success2 text-base mb-1">Successfully generated 100 UPD serial numbers</h6>
                    <div className="text-[13px] text-foreground">
                      Generated 28 July 2026 at 13:45:32
                    </div>
                  </div>
                </div>
                <Link to="/factory-overview">
                  <button type="button" className="bg-white flex items-center gap-1.5 text-accent-foreground py-3 px-5 xl:px-7 rounded-full text-sm">
                    <span>View in Overview</span>
                  </button>
                </Link>
              </div>
            )}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
