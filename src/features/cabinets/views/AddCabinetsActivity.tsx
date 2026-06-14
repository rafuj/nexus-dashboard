"use client";
import { Helmet } from "react-helmet-async";
import { ChevronLeft, ChevronRight } from "lucide-react";

import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Icons } from "@/app/icons/icons";
import {  useNavigate } from "react-router";
import { useState } from "react";
import { Label } from "@/shared/components/ui/label";
import { Textarea } from "@/shared/components/ui/textarea";
import { SingleImageUploader } from "@/shared/components/image-uploader/single-image-uploader";
import { CustomRadioGroup } from "@/shared/components/CustomRadioGroup";



import { activityStatusList } from "../mock/addCabinetActivity";
import type { ActivityStatus } from "../types/addActivity";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/components/ui/select";

export default function AddCabinetsActivity() {
  const navigate = useNavigate();

  const [activity, setActivity] = useState<ActivityStatus>('ongoing')


  const [images, setImages] = useState({
    picture1: "",
    picture2: "",
    picture3: "",
  });

  const handleImageChange = (
    key: "picture1" | "picture2" | "picture3",
    file: File | null
  ) => {
    if (!file) return;

    setImages((prev) => ({
      ...prev,
      [key]: URL.createObjectURL(file),
    }));
  };


  return (
    <>
      <Helmet>
        <title>Add Cabinets | Updaid</title>
      </Helmet>

      <main>
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-3 md:gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
              <div className="md:w-0 grow">
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Cabinets</h1>
                <ul className="text-xs lg:text-sm flex flex-wrap items-center">
                  <li>Cabinets</li>
                  <li className="mx-2"><ChevronRight size={20} /></li>
                  <li className="text-accent-foreground">List</li>
                </ul>
              </div>
              <div className="flex items-center max-sm:flex-wrap gap-2.5">
                <div className="max-sm:hidden">
                  <DateAndTimeChip />
                </div>
                <button type="button" className="flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                  <Icons.export /> <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <div className="p-5">
          <button type="button" className="inline-flex items-center gap-2 text-xl font-semibold text-accent-foreground" onClick={()=> navigate(-1)}>
            <ChevronLeft size={24} />
            <span>Add Cabinet</span>
          </button>
            <div className="border bg-white rounded-[15px] mt-4">
              <h4 className="border-b text-base font-semibold px-5 py-4">Details</h4>
              <div className="p-5">
                <div className="grid grid-cols-1 sm:grid-cols-3 my-3.75 gap-4">
                  <div>
                    <Label className="text-xs text-accent-foreground font-medium block mb-3">Activity Type*<span className="text-error">*</span></Label>
                    <Select>
                      <SelectTrigger className="w-full !h-12.5">
                        <div className="flex items-center gap-1 font-semibold text-accent-foreground w-full">
                          <span className="line-clamp-1 w-0 grow text-left"><SelectValue placeholder="Select activity type" /></span>
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="door-open">Door opened</SelectItem>
                        <SelectItem value="connectivity-lost">Connectivity lost</SelectItem>
                        <SelectItem value="asset-removed">Asset removed</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="mb-3.75">
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Activity status <span className="text-error">*</span></Label>
                  <CustomRadioGroup value={activity} setValue={setActivity} list={activityStatusList} />
                </div>
                <div>
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Situation Pictures <span className="text-foreground">(max. 3)</span></Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <SingleImageUploader
                      value={images.picture1}
                      onChange={(file) => handleImageChange("picture1", file)}
                    />
                    <SingleImageUploader
                      value={images.picture2}
                      onChange={(file) => handleImageChange("picture2", file)}
                    />
                    <SingleImageUploader
                      value={images.picture3}
                      onChange={(file) => handleImageChange("picture3", file)}
                    />
                  </div>
                </div>
                <div className="mt-3.75">
                  <Label className="text-xs text-accent-foreground font-medium block mb-3">Notes (optional)</Label>
                  <Textarea
                    placeholder="Describe the location or any important details..."
                    autoComplete="off"
                    className="px-5 placeholder:text-accent-foreground/20"
                  />
                </div>
                <div className="flex flex-wrap gap-2 sm:gap-5 justify-end py-3.75 bg-white sticky bottom-0 mt-5">
                  <button type="reset" className="flex items-center justify-center bg-chip text-accent-foreground py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]">Cancel</button>
                  <button type="submit" className="flex items-center justify-center bg-primary text-white py-2 sm:py-3 px-5 rounded-full text-sm gap-1.25 sm:w-full max-w-[140px]">Add Activity</button>
                </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
