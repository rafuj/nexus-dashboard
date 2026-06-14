import { Link, Navigate, Outlet } from "react-router"
import { useAuth } from "@/app/hooks/useAuth"
import authBg from "@/assets/auth-bg.png"
import updaidLogo from "@/assets/updaid-logo.png"

export default function AuthLayout() {
  const { user } = useAuth()

  if (user) {
    return <Navigate to="/" replace />
  }

  return (
    <main className="flex flex-col min-h-svh w-full bg-muted gap-6 p-5 md:p-7.5" style={{
      background: `url(${authBg}) no-repeat center center / cover fixed`
    }}>
      <header className="w-full flex items-center justify-between">
        <Link to="/" className="w-0 grow block max-w-[120px] md:max-w-[140px]">
          <img src={updaidLogo} className="w-full" alt="updaid" />
        </Link>
        <Link to="/contact-us" className="flex items-center justify-center bg-primary text-white py-2 px-3 sm:py-3 sm:px-5 rounded-full text-sm gap-1.25 min-w-[110px] md:min-w-[150px] md:h-12.5">
            <span>Contact Us</span>
        </Link>
      </header>
      <div className="grow flex items-center flex-wrap">
        <div className="w-full max-w-[540px] bg-white/40 rounded-[30px] px-6 py-8 md:p-10 shadow-auth mx-auto" style={{
          backdropFilter:"blur(15px)"
        }}>
          <Outlet />
        </div>
      </div>
      <div className="pt-4">
        <div className="flex flex-wrap justify-center items-center text-xs md:text-sm lg:text-base gap-3">
          <span className="text-accent-foreground">&copy; 2026, Updaid.com</span>
          <span className="h-1 w-1 rounded-full bg-accent-foreground lg:mx-3 xl:mx-7"></span>
          <Link to="" className="text-accent-foreground">Terms & Licensing</Link>
          <span className="h-1 w-1 rounded-full bg-accent-foreground lg:mx-3 xl:mx-7"></span>
          <Link to="" className="text-accent-foreground">Privacy Policy</Link>
        </div>
      </div>
    </main>
  );
}