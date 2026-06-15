import { TooltipProvider } from "@/shared/components/ui/tooltip";
import { AuthProvider } from "../context/auth/AuthProvider";
import AppRoutes from "./AppRoutes";

export function App() {
    return (
        // Wrap the app in the AuthProvider, so the user is authenticated throughout the app
        <AuthProvider>
            <TooltipProvider>
                <AppRoutes />
            </TooltipProvider>
        </AuthProvider>
    )
}

export default App;