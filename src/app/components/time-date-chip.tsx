import { useEffect, useState } from "react"
import { CalendarDays, Clock } from "lucide-react"

const DateAndTimeChip = () => {
    const [now, setNow] = useState(new Date())

    useEffect(() => {
        const interval = setInterval(() => {
            setNow(new Date())
        }, 1000)

        return () => clearInterval(interval)
    }, [])

    const formattedDate = now.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
    })

    const formattedTime = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false, // change to true for AM/PM format
    })

    return (
        <div className="flex items-center bg-chip text-accent-foreground py-3 px-5 rounded-full text-sm gap-1.25">
            <CalendarDays size={20} />
            <span>{formattedDate}</span>
            <span className="px-2.5">|</span>
            <Clock size={20} />
            <span>{formattedTime}</span>
        </div>
    )
}

export default DateAndTimeChip