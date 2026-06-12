import { Helmet } from "react-helmet-async";
import { ScrollText, Activity } from "lucide-react";
import { DashboardStatCard } from "../components/DashboardStatCard";
import { DashboardSmartCabinetActivityTable } from "../components/DashboardSmartCabinetActivityTable";
import { DashboardSystemActivityTable } from "../components/DashboardSystemActivityTable";
import {
  mockDashboardStats,
  mockRecentActivity,
  mockSystemLogs,
} from "../mock/mockDashboardStats";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/components/ui/card";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Icons } from "@/app/icons/icons";

export default function DashboardView() {
  const stats = mockDashboardStats;

  return (
    <>
      <Helmet>
        <title>Dashboard | Updaid</title>
      </Helmet>
      <main>
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-3 md:gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
              <div className="md:w-0 grow">
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">Welcome, Anne</h1>
                <p className="text-xs lg:text-sm">
                  Here's what's happening with your Updaid fleet.
                </p>
              </div>
              <div className="flex items-center max-sm:flex-wrap gap-2.5">
                <div className="max-sm:hidden">
                  <DateAndTimeChip />
                </div>
                <button type="button" className="flex items-center bg-chip text-accent-foreground py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25">
                  <Icons.export /> <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        </header>

        <div className="p-5">
          <div className="space-y-5">
            <section
              className="grid gap-4 grid-cols-[repeat(auto-fit,minmax(152px,1fr))] xl:grid-cols-[repeat(auto-fit,minmax(140px,1fr))]"
              aria-label="Key metrics"
            >
              <div className="col-span-2 py-4 px-5 relative border rounded-[20px] bg-white">
                <div className="text-sm text-accent-foreground">Network Readiness</div>
                {<Icons.network className="absolute top-5 right-5" />}
                <div>
                  <h3 className="text-2xl font-semibold mt-6 mb-2">
                    96% <span className="text-sm font-normal text-accent-foreground text-primary">ready</span>
                  </h3>
                  <p className="text-sm">
                    248 cabinets monitored
                  </p>
                </div>
              </div>
              {stats.map((stat) => (
                <DashboardStatCard key={stat.id} stat={stat} />
              ))}
            </section>
            <section className="space-y-5" aria-labelledby="activity-heading">
              <div className="space-y-1">
                <h2
                  id="activity-heading"
                  className="text-lg font-semibold tracking-tight"
                >
                  Activity
                </h2>
                <p className="text-muted-foreground max-w-2xl text-sm">
                  Cabinet-side events and tenant-level changes
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <Card className="shadow-none ring-1 ring-border/60">
                  <CardHeader className="border-border/60 flex flex-row items-start gap-2 space-y-0 border-b pb-2">
                    <div
                      className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border border-border"
                      aria-hidden
                    >
                      <Activity className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0">
                      <CardTitle className="text-base">
                        SmartCabinet recent activity
                      </CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">
                        Door, AED, maintenance, and sensor events.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 pt-0">
                    <DashboardSmartCabinetActivityTable
                      items={mockRecentActivity}
                    />
                  </CardContent>
                </Card>

                <Card className="shadow-none ring-1 ring-border/60">
                  <CardHeader className="border-border/60 flex flex-row items-start gap-3 space-y-0 border-b pb-4">
                    <div
                      className="bg-muted text-muted-foreground flex size-10 shrink-0 items-center justify-center rounded-lg border border-border"
                      aria-hidden
                    >
                      <ScrollText className="size-5" />
                    </div>
                    <div className="min-w-0 flex-1 space-y-0">
                      <CardTitle className="text-base">System activity</CardTitle>
                      <CardDescription className="text-muted-foreground text-xs">
                        Users, groups, and configuration changes in your workspace.
                      </CardDescription>
                    </div>
                  </CardHeader>
                  <CardContent className="px-0 pb-0 pt-0">
                    <DashboardSystemActivityTable items={mockSystemLogs} />
                  </CardContent>
                </Card>
              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
