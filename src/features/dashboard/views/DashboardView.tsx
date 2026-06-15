import { Helmet } from "react-helmet-async";
import { DashboardStatCard } from "../components/DashboardStatCard";
import {
  mockDashboardStats
} from "../mock/mockDashboardStats";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import DateAndTimeChip from "@/app/components/time-date-chip";
import { Icons } from "@/app/icons/icons";
import DashboardOverviewChart from "../components/DashboardOverviewChart";
import RespondersCard from "../components/RespondersCard";
import ConnectedCabinets from "../components/ConnectedCabinets";
import Certificates from "../components/Certificates";

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
            {/* Top Statistics Cards */}
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

            {/* Activity and Monitor Maintenance Overview */}
            <section className="space-y-5" aria-labelledby="activity-heading">
              <div className="grid gap-5 grid-cols-1 xl:grid-cols-[634fr_496fr]">

                {/* Conneted Canbinets Card */}
                <ConnectedCabinets />

                {/* Overview Chart */}
                <DashboardOverviewChart />

                {/* Responders Card */}
                <RespondersCard />

                {/* Certificates Card */}
                <Certificates />

              </div>
            </section>
          </div>
        </div>
      </main>
    </>
  );
}
