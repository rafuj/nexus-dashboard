import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"
import {
  Card
} from "@/shared/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/shared/components/ui/field"
import { Input } from "@/shared/components/ui/input"
import { PasswordInput } from "../components/PasswordInput"
import { Link } from "react-router"
import avatar from '@/assets/avatar.png'
import { useRef, useState } from "react"


export default function SignupForm({className, ...props } : React.ComponentProps<typeof Card>) {
    // 1. Manage the image preview state (defaults to your initial avatar)
    const [previewSrc, setPreviewSrc] = useState<string>(avatar); 
    const fileInputRef = useRef<HTMLInputElement>(null);

    // 2. Handle file selection and generate a preview URL
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Optional: Add simple validation for images
            if (!file.type.startsWith('image/')) {
                alert('Please upload an image file.');
                return;
            }

            const objectUrl = URL.createObjectURL(file);
            setPreviewSrc(objectUrl);

            // TODO: Send 'file' to your backend or cloud storage here
            console.log('Selected file:', file);
        }
    };
    return (
        <div className={cn("", className)} {...props}>
          <div>
            <h1 className="font-medium text-2xl md:text-[28px] mb-2">Sign Up</h1>
            <p className="mb-7 text-sm md:text-base">
              Create you account to join our rescue network
            </p>
          </div>
            <form>
                <FieldGroup className="gap-3">
                    {/*  */}
                    <label className="border border-dashed border-error rounded-[12px] bg-white/40 py-4.5 px-3.75 cursor-poiter">
                        <div className="flex items-center gap-2.5">
                            <img src={previewSrc} className="size-10 object-cover rounded-full" alt="" />
                            <span className="font-medium text-sm md:text-base w-0 grow"><span className="text-accent-foreground">Profile Picture</span> (optional)</span>
                            <span className="mx-2 border-l h-7 border-border"></span>
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20H19C19.2833 20 19.521 20.096 19.713 20.288C19.905 20.48 20.0007 20.7173 20 21C19.9993 21.2827 19.9033 21.5203 19.712 21.713C19.5207 21.9057 19.2833 22.0013 19 22H5C4.71667 22 4.47934 21.904 4.288 21.712C4.09667 21.52 4.00067 21.2827 4 21C3.99934 20.7173 4.09534 20.48 4.288 20.288C4.48067 20.096 4.718 20 5 20ZM10 18C9.71667 18 9.47934 17.904 9.288 17.712C9.09667 17.52 9.00067 17.2827 9 17V11H7.05C6.63334 11 6.33334 10.8127 6.15 10.438C5.96667 10.0633 6 9.709 6.25 9.375L11.2 3.025C11.3 2.89167 11.421 2.79167 11.563 2.725C11.705 2.65833 11.8507 2.625 12 2.625C12.1493 2.625 12.2953 2.65833 12.438 2.725C12.5807 2.79167 12.7013 2.89167 12.8 3.025L17.75 9.375C18 9.70833 18.0333 10.0627 17.85 10.438C17.6667 10.8133 17.3667 11.0007 16.95 11H15V17C15 17.2833 14.904 17.521 14.712 17.713C14.52 17.905 14.2827 18.0007 14 18H10ZM11 16H13V9H14.9L12 5.25L9.1 9H11V16Z" fill="#151C48"/>
                            </svg>
                            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                        </div>
                    </label>
                    <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">First Name <span className="text-error">*</span> </FieldLabel>
                                <Input type="text" placeholder="eg. John" className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5" required />
                            </div>
                        </Field>
                        <Field>
                            <div>
                                <FieldLabel className="font-medium text-accent-foreground mb-2.5">Last Name <span className="text-error">*</span> </FieldLabel>
                                <Input type="text" placeholder="eg. Smith" className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5" required />
                            </div>
                        </Field>
                    </div>
                    <Field>
                        <div>
                            <FieldLabel className="font-medium text-accent-foreground mb-2.5">Email <span className="text-error">*</span></FieldLabel>
                            <Input
                                type="email"
                                placeholder="e.g. johnsmith@xyz.com"
                                required
                                className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                        </div>
                    </Field>
                    <Field>
                        <div>
                            <FieldLabel className="font-medium text-accent-foreground mb-2.5">Phone Number <span className="text-foreground">(optional)</span></FieldLabel>
                            <Input
                                type="text"
                                placeholder="e.g. Global Rescue"
                                required
                                className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                        </div>
                    </Field>
                    <Field>
                        <div>
                            <FieldLabel className="font-medium text-accent-foreground mb-2.5">Company Name <span className="text-foreground">(optional)</span></FieldLabel>
                            <Input
                                type="text"
                                placeholder="e.g. Global Rescue"
                                required
                                className="placeholder:text-foreground/40 bg-background/40 border-border h-10 lg:h-14 md:px-5"
                            />
                        </div>
                    </Field>
                    <Field>
                        <div>
                            <FieldLabel className="font-medium text-accent-foreground mb-2.5">Password <span className="text-error">*</span></FieldLabel>
                            <PasswordInput placeholder="Choose a strong password" />
                        </div>
                    </Field>
                    <FieldGroup>
                    <Field>
                        <Button className="h-10 lg:h-14 rounded-full" type="submit">Sign Up</Button>
                        <FieldDescription className="px-6 text-center text-accent-foreground lg:text-base">
                            Already have an account? <Link to="/login" className="!no-underline font-semibold">Sign in</Link>
                        </FieldDescription>
                    </Field>
                    </FieldGroup>
                </FieldGroup>
            </form> 
        </div>
    )
}