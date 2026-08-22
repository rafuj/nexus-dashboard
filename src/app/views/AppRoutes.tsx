import { Suspense } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router";
import { Helmet, HelmetProvider } from "react-helmet-async";

import PageLayout from "@/app/layouts/PageLayout";
import AuthLayout from "@/app/layouts/AuthLayout";
import LoginForm from "@/features/auth/views/LoginForm";
import CabinetView from "@/features/cabinets/views/CabinetView";
import CabinetsListView from "@/features/cabinets/views/CabinetsListView";
import DashboardView from "@/features/dashboard/views/DashboardView";
import AddCabinets from "@/features/cabinets/views/AddCabinets";
import CabinetsActivity from "@/features/cabinets/views/CabinetsActivity";
import CabinetsMonitor from "@/features/cabinets/views/CabinetsMonitor";
import CabinetsMapView from "@/features/cabinets/views/CabinetsMapView";
import ForgotPassword from "@/features/auth/views/ForgotPassword";
import ResetPassword from "@/features/auth/views/ResetPassword";
import Settings from "@/features/settings/views/Settings";
import ExploreUpgrades from "@/features/explore-upgrades/views/ExploreUpgrades";
import MyAccount from "@/features/my-account/views/MyAccount";
import { useAuth } from "../hooks/useAuth";
import ImeiLinking from "@/features/factory/views/ImeiLinking";
import GenerateSerialNumber from "@/features/factory/views/GenerateSerialNumber";
import FactoryOverview from "@/features/factory/views/FactoryOverview";
import SignUp from "@/features/auth/views/SignUp";

const helmetContext = {};

export default function AppRoutes() {

  const user = useAuth();

  const routesByRole = () => {
    switch(user?.role) {
      case "super":
        return <>
          <Route path="/" element={<ImeiLinking />} />
          <Route path="/generate-serial-number" element={<GenerateSerialNumber />} />
          <Route path="/factory-overview" element={<FactoryOverview />} />
        </>
      default :
        return <>
          <Route path="/" element={<DashboardView />} />
        </>
    }
  }

  return (
    <BrowserRouter>
      <HelmetProvider context={helmetContext}>
        <Helmet>
          <meta charSet="utf-8" />
          <title>Updaid</title>
        </Helmet>
        <Suspense fallback="loading...">
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<LoginForm />} />

              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/signup" element={<SignUp />} />
            </Route>

            <Route element={<PageLayout />}>

              {/* Common Routes */}
              <Route path="/cabinets" element={<Navigate to="/cabinets/list" replace />} />
              <Route path="/cabinets/list" element={<CabinetsListView />} />
              <Route path="/cabinets/add" element={<AddCabinets />} />
              <Route path="/cabinets/activity" element={<CabinetsActivity />} />
              <Route path="/cabinets/monitor" element={<CabinetsMonitor />} />
              <Route path="/cabinets/map" element={<CabinetsMapView />} />
              <Route path="/cabinets/list/:id" element={<CabinetView />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/my-account" element={<MyAccount />} />
              
              {/* Routes by Role */}
              {routesByRole()}

            </Route>
            <Route path="/explore-upgrade" element={<ExploreUpgrades />} />
          </Routes>
        </Suspense>
      </HelmetProvider>
    </BrowserRouter>
  );
}
