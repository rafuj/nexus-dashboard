import DateAndTimeChip from "@/app/components/time-date-chip";
import { CollapsedSidebarTrigger } from "@/app/layouts/PageLayout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router";
const NotFound = () => {
  return (
    <>
      <Helmet>
        <title>Explore Upgrades | Updaid</title>
      </Helmet>
      <main>
        
        <header className="shrink-0 items-center gap-2 bg-card sticky top-0 z-20 border-b p-5">
          <div className="flex items-center gap-3 md:gap-5">
            <CollapsedSidebarTrigger />
            <div className="grow w-0 flex items-center justify-between max-md:flex-wrap gap-4 md:gap-7">
              <div className="md:w-0 grow">
                <h1 className="text-xl font-medium lg:text-4xl lg:leading-[1] tracking-tight mb-1 md:mb-3">404</h1>
                <ul className="text-xs lg:text-sm flex flex-wrap items-center">
                  <li>Page not found</li>
                </ul>
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
            <div className="text-center py-30">
                <h1 className="text-8xl font-bold">404</h1>

                <h2 className="mt-4 text-2xl font-semibold text-accent-foreground">
                    Page not found
                </h2>

                <p className="mt-2 mb-10">
                    Sorry, the page you are looking for doesn't exist.
                </p>

                <Link
                    to="/"
                    className="mt-6 rounded-md text-primary px-4 py-2 underline"
                >
                    Go back home
                </Link>
            </div>
        </div>
      </main>
    </>
  );
};

export default NotFound;