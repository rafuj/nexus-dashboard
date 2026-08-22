import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { AuthProvider } from "../context/auth/AuthProvider";
import AppRoutes from "./AppRoutes";
import { Toaster } from "react-hot-toast";

export function App() {
    return (
        // Wrap the app in the AuthProvider, so the user is authenticated throughout the app
        <AuthProvider>
            <TooltipProvider>
                <AppRoutes />
                <Toaster position="top-right" />
            </TooltipProvider>
        </AuthProvider>
    )
}

export default App;