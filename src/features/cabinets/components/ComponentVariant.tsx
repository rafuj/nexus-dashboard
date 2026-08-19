import { DatePicker } from "@/shared/components/ui/date-picker";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { InfoIcon } from "lucide-react";
import type { ComponentTypesAED } from "../api/componentTypes.api";
import { useComponentTypesVariants } from "../hooks/useComponentTypesVariants";
import type { FormikProps } from "formik";
import type { AssetFormValues } from "../views/AddCabinets";

interface ComponentVariantProps {
    componentType: ComponentTypesAED[],
    assetFormik: FormikProps<AssetFormValues>
}
export default function ComponentVariant({ componentType, assetFormik }: ComponentVariantProps) {
    const { data: componentTypeDataVariants } = useComponentTypesVariants(componentType.id)

    const { values, touched, errors, setFieldValue, handleChange } = assetFormik;

    const renderError = (
        touchedValue: boolean | undefined,
        errorValue: string | undefined,
    ) => {
        if (!touchedValue || !errorValue) return null;

        return (
            <p className="mt-1 text-xs text-error">
                {errorValue}
            </p>
        );
    };

    if(componentType.id === "1")
        return (
            <div className="mt-5">
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                    <span className="w-0 grow capitalize">{componentType.name} Information</span>
                    <InfoIcon size={20} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 my-3.75 gap-4">
                <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">1st set pads for<span className="text-error">*</span></Label>
                    <Select value={values.padsInformation?.firstSetPads?.for}
                        onValueChange={(value)=> setFieldValue("padsInformation.firstSetPads.for", value)}
                    >
                    <SelectTrigger className="w-full !h-12.5">
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                        <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select" /></span>
                        </div>
                    </SelectTrigger>
                    <SelectContent>
                        {componentTypeDataVariants?.map(variant => <SelectItem key={variant.id} value={variant.name}>{variant.name}</SelectItem> )}
                    </SelectContent>
                    </Select>
                        {renderError(
                            touched?.padsInformation,
                            errors.padsInformation?.firstSetPads?.for,
                        )}
                </div>
                <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">1st set pads expiration date<span className="text-error">*</span></Label>
                    <DatePicker value={values.padsInformation?.firstSetPads?.expiration} 
                    onChange={(value)=> setFieldValue("padsInformation.firstSetPads.expiration", value)}
                    className="!bg-white text-xs pl-5 pr-4" />
                    {renderError(
                        touched?.padsInformation,
                        errors.padsInformation?.firstSetPads?.expiration,
                    )}
                </div>
                <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">1st set pads Iot number</Label>
                    <Input
                        placeholder="e.g. 14454"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                        value={values.padsInformation?.firstSetPads.IotNumber}
                        onChange={(e)=> setFieldValue("padsInformation.firstSetPads.IotNumber", e.target.value)}
                    />
                </div>
                <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">2nd set pads for</Label>
                    <Select value={values.padsInformation?.secondSetPads.for}
                        onValueChange={(value)=> setFieldValue("values.padsInformation?.secondSetPads.for", value)}
                    >
                        <SelectTrigger className="w-full !h-12.5">
                            <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                            <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select" /></span>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {componentTypeDataVariants?.map(variant => <SelectItem key={variant.id} value={variant.name}>{variant.name}</SelectItem> )}
                        </SelectContent>
                    </Select>
                </div>
                <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">2nd set pads expiration date</Label>
                    <DatePicker value={values.padsInformation?.secondSetPads.expiration} 
                        onChange={(value)=> setFieldValue("padsInformation.secondSetPads.expiration", value)}
                        className="!bg-white text-xs pl-5 pr-4" />
                </div>
                <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">2nd set pads Iot number</Label>
                    <Input
                        placeholder="e.g. 14454"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                        value={values.padsInformation?.secondSetPads.IotNumber}
                        onChange={handleChange}
                        name="padsInformation.secondSetPads.IotNumber"
                    />
                </div>
                </div>
            </div>
        )
    return (<>
        <div className="mt-5">
            <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                <span className="w-0 grow capitalize">{componentType.name} Information</span>
                <InfoIcon size={20} />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 my-3.75 gap-4">
                <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Battery expiration date<span className="text-error">*</span></Label>
                    <DatePicker value={values.batteryInformation.batteryExpiration} onChange={(value)=> setFieldValue("batteryInformation.batteryExpiration", value)} className="!bg-white text-xs pl-5 pr-4" />
                    {renderError(
                        touched.batteryInformation,
                        errors.batteryInformation?.batteryExpiration,
                    )}
                </div>
                <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Battery serial number</Label>
                    <Input
                        placeholder="e.g. SN928492819"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                        name="batteryInformation.batterySerial"
                        value={values.batteryInformation.batterySerial}
                        onChange={handleChange}
                    />
                </div>
                <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Battery lot number</Label>
                    <Input
                        placeholder="e.g. B-98765"
                        autoComplete="off"
                        className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                        name="batteryInformation.batteryIotNumber"
                        value={values.batteryInformation.batteryIotNumber}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </div>
    </>)
}