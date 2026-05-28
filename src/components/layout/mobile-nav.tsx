"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Bot, CircleDollarSign, Gauge, ReceiptText, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const mobileItems = [
  { href: "/dashboard", label: "Início", icon: Gauge },
  { href: "/transacoes", label: "Lançar", icon: CircleDollarSign },
  { href: "/contas", label: "Contas", icon: ReceiptText },
  { href: "/copiloto", label: "Ajuda", icon: Bot },
  { href: "/configuracoes", label: "Ajustes", icon: Settings },
]

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur lg:hidden"
      aria-label="Navegação principal no celular"
    >
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1">
        {mobileItems.map((item) => {
          const active = pathname === item.href
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex min-h-14 flex-col items-center justify-center gap-1 rounded-xl text-xs font-medium outline-none focus-visible:ring-3 focus-visible:ring-ring/50",
                active ? "bg-primary text-primary-foreground" : "text-muted-foreground",
              )}
              aria-current={active ? "page" : undefined}
            >
              <Icon aria-hidden="true" />
              <span>{item.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
