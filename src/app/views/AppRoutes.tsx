import { Suspense } from "react";
import { Route, Routes, BrowserRouter, Navigate } from "react-router";
import { Helmet, HelmetProvider } from "react-helmet-async";

import PageLayout from "@/app/layouts/PageLayout";
import AuthLayout from "@/app/layouts/AuthLayout";
import LoginForm from "@/features/auth/views/LoginForm";
import SignupForm from "@/features/auth/views/SignupForm";
import CabinetView from "@/features/cabinets/views/CabinetView";
import CabinetsListView from "@/features/cabinets/views/CabinetsListView";
import DashboardView from "@/features/dashboard/views/DashboardView";
import AddCabinets from "@/features/cabinets/views/AddCabinets";
import AddCabinetsActivity from "@/features/cabinets/views/AddCabinetsActivity";
import CabinetsActivity from "@/features/cabinets/views/CabinetsActivity";
import CabinetsMonitor from "@/features/cabinets/views/CabinetsMonitor";
import CabinetsMapView from "@/features/cabinets/views/CabinetsMapView";
import ForgotPassword from "@/features/auth/views/ForgotPassword";

const helmetContext = {};

export default function AppRoutes() {
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
              <Route path="/signup" element={<SignupForm />} />
            </Route>

            <Route element={<PageLayout />}>
              <Route path="/" element={<DashboardView />} />
              <Route path="/cabinets" element={<Navigate to="/cabinets/list" replace />} />
              <Route path="/cabinets/list" element={<CabinetsListView />} />
              <Route path="/cabinets/add" element={<AddCabinets />} />
              <Route path="/cabinets/activity" element={<CabinetsActivity />} />
              <Route path="/cabinets/activity/add" element={<AddCabinetsActivity />} />
              <Route path="/cabinets/monitor" element={<CabinetsMonitor />} />
              <Route path="/cabinets/map" element={<CabinetsMapView />} />
              <Route path="/cabinetview" element={<CabinetView />} />
            </Route>
          </Routes>
        </Suspense>
      </HelmetProvider>
    </BrowserRouter>
  );
}
