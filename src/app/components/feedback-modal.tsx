import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/shared/components/ui/dialog"
import { XCircle } from "lucide-react"

import { useState, type Dispatch, type SetStateAction } from "react"
import { Textarea } from "@/shared/components/ui/textarea"
import { cn } from "@/lib/utils"
import { Button } from "@/shared/components/ui/button"

interface ModalProps {
  open: boolean,
  setOpen: Dispatch<SetStateAction<boolean>>
}


export const FeedbackModal: React.FC<ModalProps>  = ({ open, setOpen }) => {
  const [rating, setRating] = useState<number | null>(9);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <form>
        <DialogContent className="sm:max-w-[535px] bg-white" showCloseButton={false}> 
          <DialogHeader className="gap-0.5 pt-2">
            <DialogTitle className="text-2xl font-semibold text-accent-foreground">Feedback</DialogTitle>
            <DialogTrigger className="text-primary absolute top-5 right-5">
                <XCircle />
            </DialogTrigger>
            <DialogDescription className="text-xs">
              We value your opinions
            </DialogDescription>
          </DialogHeader>
          <div>
            <h2 className="text-sm font-semibold mb-3">How satisfied were you when using the website?</h2>
            <div className="grid grid-cols-10 gap-2">
              {Array.from({ length: 10 }, (_, i) => {
                const value = i + 1;

                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setRating(value)}
                    className={cn(
                      "flex items-center justify-center rounded-full text-sm font-semibold aspect-square",
                      rating === value
                        ? "bg-primary text-white"
                        : "bg-chip text-accent-foreground hover:bg-primary/5"
                    )}
                  >
                    {value}
                  </button>
                );
              })}
            </div>
            <div className="text-xs flex justify-between items-center mt-2 mb-5.5">
              <span>Not satisfied</span>
              <span>Very satisfied</span>
            </div>
            <h2 className="text-sm font-semibold mb-2">Do you have any suggestions for us?</h2>
            <Textarea placeholder="You can write them here. All suggestions are welcome!" className="placeholder:text-[#737792] p-5" />
            <div className="mt-7.25 flex justify-center pb-3">
              <Button variant="default" className="rounded-full h-12.5 min-w-[180px]">Send</Button>
            </div>
          </div>
        </DialogContent>
      </form>
    </Dialog>
  )
}
