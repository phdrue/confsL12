import type React from "react"
import { cn } from "@/lib/utils"

interface AppLogoIconProps extends React.HTMLAttributes<HTMLImageElement> {
    className?: string
}

export default function AppLogoIcon({ className, ...props }: AppLogoIconProps) {
    return <img src="/img/small_logo1.png" alt="логотип" className={cn('size-12 mr-4', className)} {...props} />
}