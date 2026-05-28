"use client"

import { AppHeader } from "@/components/layout/app-header"
import { AppSidebar } from "@/components/layout/app-sidebar"
import { MobileNav } from "@/components/layout/mobile-nav"
import { useFinance } from "@/components/providers/finance-provider"
import { cn } from "@/lib/utils"

export function AppFrame({ children }: { children: React.ReactNode }) {
  const { data } = useFinance()

  return (
    <div
      className={cn(
        "min-h-dvh bg-[linear-gradient(180deg,var(--background),var(--cf-page-soft))] text-foreground",
        data.profile.visual_mode === "simple" && "simple-mode",
        data.profile.font_scale === "large" && "font-scale-large",
        data.profile.font_scale === "extra-large" && "font-scale-extra-large",
      )}
    >
      <div className="flex">
        <AppSidebar />
        <div className="min-w-0 flex-1 pb-24 lg:pb-0">
          <AppHeader />
          <main className="mx-auto flex w-full max-w-7xl flex-col gap-6 px-4 py-5 sm:px-6 lg:px-8 lg:py-8">
            {children}
          </main>
        </div>
      </div>
      <MobileNav />
    </div>
  )
}
