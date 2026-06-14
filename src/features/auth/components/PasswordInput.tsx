import { Input } from "@/shared/components/ui/input"
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";

function PasswordInput ({ className, type, ...props }: React.ComponentProps<"input">) {
    const [passwordType, setPasswordType] = useState<'text'|'password'>('password')
    return (
        <div className="relative">
            <Input
                type={passwordType}
                placeholder="Enter your password"
                className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                {...props}
            />
            <button type="button" className="absolute right-3 md:right-5 top-1/2 -translate-y-1/2" onClick={()=> setPasswordType(passwordType==='password'?'text':'password')}>
                {passwordType ==='password'?<Eye />:<EyeOff />}
            </button>
        </div>
    )
}
export { PasswordInput };