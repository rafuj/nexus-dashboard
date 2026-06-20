"use client";

import { Helmet } from "react-helmet-async";

import { PlusCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { useQueryState } from "nuqs";
import { Icons } from "@/app/icons/icons";
import MemberSetting from "../components/MemberSetting";
import GroupSettings from "../components/GroupSettings";
import { CreateGroupDrawer } from "../components/CreateGroupDrawer";
import { useState } from "react";



export default function Settings() {

  const tablist = ["group", "members"]
const [tabValue, setTabValue] = useQueryState("tabs", { defaultValue: "group" })
const [createGroupOpen, setCreateGroupOpen] = useState<boolean>(false)
const [addMemberOpen, setAddMemberOpen] = useState<boolean>(false)

const switchContent = (value: string) =>{
  switch (value) {
    case 'members':
      return <MemberSetting />
    default:
      return <GroupSettings />
  }
}

  return (
    <>
      <Helmet>
        <title>Cabinets | Updaid</title>
      </Helmet>

      <main>
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-3 md:gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
              <div className="md:w-0 grow">
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Settings</h1>
                <ul className="text-xs lg:text-sm flex flex-wrap items-center">
                  <li>Manage groups and member preferences.</li>
                </ul>
              </div>
              <div className="flex items-center max-sm:flex-wrap gap-2.5">
                <div className="max-sm:hidden">
                  <DateAndTimeChip />
                </div>
                <button type="button" className="flex sm:hidden items-center bg-primary text-white py-2 px-3 md:py-3 md:px-5 rounded-full text-sm gap-1.25" 
                  onClick={()=> tabValue === 'group' ? setCreateGroupOpen(true) : setAddMemberOpen(true)}
                  >
                  <PlusCircle/> <span>{tabValue === 'group' ? 'Create Group' : 'Add Member'}</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5">
          <section aria-label="Cabinets">
            <div
              className={cn(
                "bg-white border rounded-[10px] border-border pb-5 px-4",
              )}
            >
            <div className="mb-5 flex flex-wrap justify-between border-b-2 border-border">
              <ul className="flex text-base sm:text-lg md:text-2xl translate-y-[2px] select-none">
                {
                  tablist.map(item=> <li key={item} className={cn("capitalize text-accent-foreground px-2 sm:px-4 xl:px-11 border-b-2 border-transparent py-5 sm:py-7 cursor-pointer", {
                    "text-primary font-semibold border-primary": tabValue === item
                  })} onClick={()=> setTabValue(item)}>{item}</li> )
                }
              </ul>
              <div className="flex items-center max-sm:flex-wrap gap-2.5 self-center">
                  <button type="button" className="h-10 md:!h-12.5 flex items-center justify-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                    <Icons.export /> <span>Export</span>
                  </button>
                <div className="max-sm:hidden">
                  <button type="button" className="flex items-center bg-primary text-white py-2 px-3 md:py-3 md:px-5 rounded-full text-sm gap-1.25" 
                    onClick={()=> tabValue === 'group' ? setCreateGroupOpen(true) : setAddMemberOpen(true)}
                    >
                    <PlusCircle/> <span>{tabValue === 'group' ? 'Create Group':'Add Member'}</span>
                  </button>
                </div>
              </div>
            </div>
                {switchContent(tabValue)}
            </div>
          </section>
        </div>
      </main>
      <CreateGroupDrawer open={createGroupOpen} setOpen={setCreateGroupOpen} />
    </>
  );
}
