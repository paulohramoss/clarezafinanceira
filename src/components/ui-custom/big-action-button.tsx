import type { ComponentProps } from "react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function BigActionButton({ className, ...props }: ComponentProps<typeof Button>) {
  return (
    <Button
      className={cn("min-h-12 w-full justify-center rounded-xl px-5 text-base md:w-auto", className)}
      {...props}
    />
  )
}
