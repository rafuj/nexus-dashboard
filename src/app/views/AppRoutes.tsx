import { Suspense } from "react";
import { Route, Routes, BrowserRouter } from "react-router";
import { Helmet, HelmetProvider } from "react-helmet-async";

import PageLayout from "@/app/layouts/PageLayout";
import AuthLayout from "@/app/layouts/AuthLayout";
import LoginForm from "@/features/auth/views/LoginForm";
import SignupForm from "@/features/auth/views/SignupForm";
import CabinetView from "@/features/cabinets/views/CabinetView";
import CabinetsListView from "@/features/cabinets/views/CabinetsListView";
import DashboardView from "@/features/dashboard/views/DashboardView";
import AddCabinets from "@/features/cabinets/views/AddCabinets";

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
              <Route path="/signup" element={<SignupForm />} />
            </Route>

            <Route element={<PageLayout />}>
              <Route path="/" element={<DashboardView />} />
              <Route path="/cabinets" element={<CabinetsListView />} />
              <Route path="/cabinets/add" element={<AddCabinets />} />
              <Route path="/cabinetview" element={<CabinetView />} />
            </Route>
          </Routes>
        </Suspense>
      </HelmetProvider>
    </BrowserRouter>
  );
}
