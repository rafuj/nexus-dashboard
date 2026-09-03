"use client";
import { ArrowLeft, CheckCircle, History, Users, Wifi } from "lucide-react";
import { Helmet } from "react-helmet-async";

import whyConnectedImg from "@/assets/why-connected.avif"
import { Link, useLocation } from "react-router";
import updaidLogo from "@/assets/updaid-logo.png"
import { useEffect } from "react";

export default function ExploreUpgrades() {

  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  
  return (
    <>
      <Helmet>
        <title>Explore Upgrades | Updaid</title>
      </Helmet>
      <main>
        <header className="py-5 bg-white">
          <div className="px-5 container mx-auto">
            <div className="flex justify-between items-center">
              <Link to="/" className="w-[140px] block max-md:max-w-[120px]">
                <img src={updaidLogo} className="w-full" alt="updaid" />
              </Link>
              <Link to="/" className="flex items-center gap-2 text-sm underline text-accent-foreground">
                <ArrowLeft size={18} />
                Back to dashboard
              </Link>
            </div>
          </div>
        </header>
          <div className="container px-5 mx-auto max-w-[1200px] pb-16">
            <div className="text-center pt-16 pb-10">
              <span className="bg-card-info-stroke text-info rounded-full px-3 py-1.5 uppercase inline-block text-xs">Upgrade Available</span>
              <h1 className="text-3xl md:text-4xl xl:text-5xl font-medium my-5">Unlock Full Potential of Your Fleet</h1>
              <p className="text-sm md:text-lg max-w-[920px] mx-auto">
                Upgrade to Connected Cabinets for real-time monitoring, live activity logs, and predictive system health alerts. Experience enterprise-grade reliability in the palm of your hand.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
              <div className="px-5 py-7 bg-white border rounded-md group">
                <div className="w-10 h-10 rounded-full bg-accent-foreground flex items-center justify-center text-white group-hover:bg-primary duration-300 transition-all">
                  <Wifi size={16} />
                </div>
                <h6 className="text-lg font-medium my-3">Real-time connectivity</h6>
                <p className="text-xs leading-5">
                  Monitor cabinet health from anywhere in
                  the world. High-frequency data polling
                  ensures you're never more than a second
                  away from the truth.
                </p>
              </div>
              <div className="px-5 py-7 bg-white border rounded-md group">
                <div className="w-10 h-10 rounded-full bg-accent-foreground flex items-center justify-center text-white group-hover:bg-primary duration-300 transition-all">
                  <History size={16} />
                </div>
                <h6 className="text-lg font-medium my-3">Live activity logs</h6>
                <p className="text-xs leading-5">
                  View events, alerts, and status updates as
                  they happen. A persistent, searchable
                  audit trail for every access request and
                  system event.
                </p>
              </div>
              <div className="px-5 py-7 bg-white border rounded-md group">
                <div className="w-10 h-10 rounded-full bg-accent-foreground flex items-center justify-center text-white group-hover:bg-primary duration-300 transition-all">
                  <Users size={16} />
                </div>
                <h6 className="text-lg font-medium my-3">Enhanced management</h6>
                <p className="text-xs leading-5">
                  Manage roles and notifications across
                  your entire team. Granular permissions
                  and automated escalations for
                  responders.
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white py-16">
            <div className="container px-5 mx-auto max-w-[1200px]">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <img src={whyConnectedImg} alt="" className="w-full rounded object-cover" />
                <div className="">
                  <h2 className="text-2xl md:text-3xl font-medium mb-5">Why Connected?</h2>
                  <ul className="text-sm flex flex-col gap-3">
                    <li className="flex gap-2">
                      <CheckCircle size={16} className="text-success translate-y-0.5" />
                      <span className="grow w-0 gap-2">Reduced downtime through predictive maintenance algorithms that alert you before a failure occurs.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} className="text-success translate-y-0.5" />
                      <span className="grow w-0 gap-2">Centralized dashboard for global fleet management, eliminating the need for local site visits for basic diagnostic tasks.</span>
                    </li>
                    <li className="flex gap-2">
                      <CheckCircle size={16} className="text-success translate-y-0.5" />
                      <span className="grow w-0 gap-2">Immediate emergency escalation workflows that sync across all mobile devices in your responder network.</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="pt-12">
                <div className="text-center pt-16 pb-10">
                  <h2 className="text-2xl md:text-3xl xl:text-4xl font-medium mb-5">Ready to optimize?</h2>
                  <p className="text-sm md:text-lg max-w-[560px] mx-auto">
                    Join the 1,200+ industrial networks currently leveraging real-time connectivity to save on operational overhead.
                  </p>
                  <div className="flex flex-wrap items-center justify-center gap-5 mt-7">
                    <Link to="https://updaid.com/pricing/" target="_blank">
                      <button type="button" className="flex items-center bg-primary text-white py-2 px-3 sm:py-4 sm:px-10 rounded-full gap-1.25">
                        Upgrade Now
                      </button>
                    </Link>
                    <Link to="https://updaid.com/pricing/" target="_blank" className="underline text-accent-foreground text-sm">Contact Sales for Enterprise</Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t text-center text-accent-foreground text-xs py-5">
            &copy; 2026, Updaid.com
          </div>
      </main>
    </>
  );
}
