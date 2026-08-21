import { DatePicker } from "@/shared/components/ui/date-picker";
import { Input } from "@/shared/components/ui/input";
import { Label } from "@/shared/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";
import { InfoIcon } from "lucide-react";
import type { ComponentTypesAED } from "../api/componentTypes.api";
import { useComponentTypesVariants } from "../hooks/useComponentTypesVariants";
import type { FormikErrors, FormikProps } from "formik";
import type { CreateCabinetFormValues } from "../api/cabinet.api";

interface ComponentVariantProps {
    componentType: ComponentTypesAED,
    formik: FormikProps<CreateCabinetFormValues>,
    fieldsReadOnly?: boolean
}
export default function ComponentVariant({ componentType, formik, fieldsReadOnly = false }: ComponentVariantProps) {
    const { data: componentTypeDataVariants } = useComponentTypesVariants(componentType.id)

    const { values, touched, errors, setFieldValue, handleChange } = formik;

    const components = values.asset?.components || [];

    // Helper to find the index of an item in values.asset.components
    const findComponentIndex = (typeId:string, isSecondSet = false) => {
        let count = 0;
        return components.findIndex((comp) => {
        if (comp.componentTypeId === typeId) {
            if (!isSecondSet) return true;
            if (count === 1) return true;
            count++;
        }
        return false;
        });
    };

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

    // -------------------------------------------------------------
    // 1. PADS UI (componentTypeId === "1")
    // -------------------------------------------------------------
    if (componentType.id === "1") {
        // Locate index for 1st set pads and 2nd set pads
        const firstSetIdx = findComponentIndex("1", false);
        const secondSetIdx = findComponentIndex("1", true);

        return (
            <div className="mt-5">
                <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                <span className="w-0 grow capitalize">{componentType.name} Information</span>
                <InfoIcon size={20} />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 my-3.75 gap-4">
                {/* --- 1ST SET PADS --- */}
                {firstSetIdx !== -1 && (
                    <>
                    {/* Variant / For */}
                    <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">
                        1st set pads for<span className="text-error">*</span>
                        </Label>
                        <Select
                            value={components[firstSetIdx]?.componentVariantId || ""}
                            onValueChange={(variantId) => {
                                // Find the full variant object from your options list
                                const selectedVariant = componentTypeDataVariants?.find((v) => v.id === variantId);
                                // Set both the ID and Name in Formik state
                                setFieldValue(`asset.components[${firstSetIdx}].componentVariantId`, variantId)
                                setFieldValue(`asset.components[${firstSetIdx}].componentVariantName`, selectedVariant?.name)
                            }}
                            disabled={fieldsReadOnly}
                        >
                        <SelectTrigger className="w-full !h-12.5">
                            <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                            <span className="line-clamp-1 w-0 grow text-left">
                                <SelectValue placeholder="Select" />
                            </span>
                            </div>
                        </SelectTrigger>
                        <SelectContent>
                            {componentTypeDataVariants?.map((variant) => (
                            <SelectItem key={variant.id+'i'} value={variant.id}>
                                {variant.name}
                            </SelectItem>
                            ))}
                        </SelectContent>
                        </Select>
                        {renderError(
                            !!touched?.asset,
                            (errors?.asset?.components?.[0] as FormikErrors<{ expiresAt?: string }> | undefined)?.expiresAt
                        )}
                    </div>

                    {/* Expiration Date */}
                    <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">
                        1st set pads expiration date<span className="text-error">*</span>
                        </Label>
                        <DatePicker
                            value={components[firstSetIdx]?.expiresAt || undefined}
                            onChange={(val) => setFieldValue(`asset.components[${firstSetIdx}].expiresAt`, val)}
                            className="!bg-white text-xs pl-5 pr-4"
                            dateType="future"
                            disabled={fieldsReadOnly}
                        />
                        {renderError(
                            !!touched?.asset,
                            (errors?.asset?.components?.[0] as FormikErrors<{ expiresAt?: string }> | undefined)?.expiresAt
                        )}
                    </div>

                    {/* Lot Number */}
                    <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">
                        1st set pads Lot number
                        </Label>
                        <Input
                            placeholder="e.g. 14454"
                            autoComplete="off"
                            className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                            name={`asset.components[${firstSetIdx}].lotNumber`}
                            value={components[firstSetIdx]?.lotNumber || ""}
                            onChange={handleChange}
                            readOnly={fieldsReadOnly}
                        />
                    </div>
                    </>
                )}

                {/* --- 2ND SET PADS --- */}
                {secondSetIdx !== -1 && (
                    <>
                    {/* Variant / For */}
                    <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">
                        2nd set pads for
                        </Label>
                        <Select
                            value={components[secondSetIdx]?.componentVariantId || ""}
                            onValueChange={(variantId) => {
                                // Find the full variant object from your options list
                                const selectedVariant = componentTypeDataVariants?.find((v) => v.id === variantId);
                                // Set both the ID and Name in Formik state
                                setFieldValue(`asset.components[${secondSetIdx}].componentVariantId`, variantId)
                                setFieldValue(`asset.components[${secondSetIdx}].componentVariantName`, selectedVariant?.name)
                            }}
                            disabled={fieldsReadOnly}
                        >
                            <SelectTrigger className="w-full !h-12.5">
                                <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                                <span className="line-clamp-1 w-0 grow text-left">
                                    <SelectValue placeholder="Select" />
                                </span>
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {componentTypeDataVariants?.map((variant) => (
                                <SelectItem key={variant.id} value={variant.id}>
                                    {variant.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    {/* Expiration Date */}
                    <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">
                        2nd set pads expiration date
                        </Label>
                        <DatePicker
                            value={components[secondSetIdx]?.expiresAt || undefined}
                            onChange={(val) => setFieldValue(`asset.components[${secondSetIdx}].expiresAt`, val)}
                            className="!bg-white text-xs pl-5 pr-4"
                            dateType="future"
                            disabled={fieldsReadOnly}
                        />
                    </div>

                    {/* Lot Number */}
                    <div>
                        <Label className="text-xs text-accent-foreground font-medium block mb-3">
                        2nd set pads Lot number
                        </Label>
                        <Input
                            placeholder="e.g. 14454"
                            autoComplete="off"
                            className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                            name={`asset.components[${secondSetIdx}].lotNumber`}
                            value={components[secondSetIdx]?.lotNumber || ""}
                            onChange={handleChange}
                            readOnly={fieldsReadOnly}
                        />
                    </div>
                    </>
                )}
                </div>
            </div>
        );
    }

    // -------------------------------------------------------------
    // 2. BATTERY UI (componentTypeId === "2")
    // -------------------------------------------------------------
    const batteryIdx = findComponentIndex("2");

    if (batteryIdx === -1) return null;

    return (
        <div className="mt-5">
            <div className="p-2.5 text-accent-foreground font-semibold flex items-center bg-border rounded-[8px] mb-3.75">
                <span className="w-0 grow capitalize">{componentType.name} Information</span>
                <InfoIcon size={20} />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 my-3.75 gap-4">
                {/* Expiration Date */}
                <div>
                <Label className="text-xs text-accent-foreground font-medium block mb-3">
                    Battery expiration date<span className="text-error">*</span>
                </Label>
                <DatePicker
                    value={components[batteryIdx]?.expiresAt || undefined}
                    onChange={(val) => setFieldValue(`asset.components[${batteryIdx}].expiresAt`, val)}
                    className="!bg-white text-xs pl-5 pr-4"
                    dateType="future"
                    disabled={fieldsReadOnly}
                />
                {renderError(
                    !!touched?.asset,
                    (errors?.asset?.components?.[2] as FormikErrors<{ expiresAt?: string }> | undefined)?.expiresAt
                )}
                </div>

                {/* Serial Number */}
                <div>
                <Label className="text-xs text-accent-foreground font-medium block mb-3">
                    Battery serial number
                </Label>
                <Input
                    placeholder="e.g. SN928492819"
                    autoComplete="off"
                    className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                    name={`asset.components[${batteryIdx}].serialNumber`}
                    value={components[batteryIdx]?.serialNumber || ""}
                    onChange={handleChange}
                    readOnly={fieldsReadOnly}
                />
                </div>

                {/* Lot Number */}
                <div>
                <Label className="text-xs text-accent-foreground font-medium block mb-3">
                    Battery lot number
                </Label>
                <Input
                    placeholder="e.g. B-98765"
                    autoComplete="off"
                    className="h-12.5 px-5 placeholder:text-accent-foreground/20"
                    name={`asset.components[${batteryIdx}].lotNumber`}
                    value={components[batteryIdx]?.lotNumber || ""}
                    onChange={handleChange}
                    readOnly={fieldsReadOnly}
                />
                </div>
            </div>
        </div>
    );
};