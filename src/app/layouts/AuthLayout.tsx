import { Navigate, Outlet } from "react-router"

import { useAuth } from "@/app/hooks/useAuth"

export default function AuthLayout() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <div className="flex min-h-svh w-full items-center justify-center bg-muted gap-6 p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <Outlet />
      </div>
      
    </div>
  );
}