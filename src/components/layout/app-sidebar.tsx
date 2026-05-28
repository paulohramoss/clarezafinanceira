"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useMemo, useState } from "react"
import {
  Bot,
  BellRing,
  Building2,
  CalendarClock,
  ChartNoAxesCombined,
  ChevronDown,
  CircleDollarSign,
  FileDown,
  Gauge,
  Landmark,
  ListChecks,
  LifeBuoy,
  PiggyBank,
  ReceiptText,
  Repeat2,
  Settings,
  Target,
  WalletCards,
} from "lucide-react"
import { cn } from "@/lib/utils"

const primaryItem = { href: "/dashboard", label: "Dashboard", icon: Gauge }

const navGroups = [
  {
    id: "dinheiro",
    label: "Dinheiro",
    icon: WalletCards,
    items: [
      { href: "/instituicoes", label: "Instituições", icon: Building2 },
      { href: "/transacoes", label: "Transações", icon: CircleDollarSign },
      { href: "/contas", label: "Contas", icon: ReceiptText },
      { href: "/importar", label: "Importar", icon: FileDown },
    ],
  },
  {
    id: "compromissos",
    label: "Compromissos",
    icon: CalendarClock,
    items: [
      { href: "/alertas", label: "Alertas", icon: BellRing },
      { href: "/assinaturas", label: "Assinaturas", icon: Repeat2 },
      { href: "/dividas", label: "Dívidas", icon: Landmark },
    ],
  },
  {
    id: "planejamento",
    label: "Planejamento",
    icon: PiggyBank,
    items: [
      { href: "/metas", label: "Metas", icon: Target },
      { href: "/relatorios", label: "Relatórios", icon: ChartNoAxesCombined },
    ],
  },
  {
    id: "apoio",
    label: "Apoio",
    icon: LifeBuoy,
    items: [
      { href: "/copiloto", label: "Copiloto", icon: Bot },
      { href: "/configuracoes", label: "Configurações", icon: Settings },
    ],
  },
]

export function AppSidebar() {
  const pathname = usePathname()
  const activeGroupId = useMemo(
    () => navGroups.find((group) => group.items.some((item) => item.href === pathname))?.id ?? null,
    [pathname],
  )
  const [manualOpenGroup, setManualOpenGroup] = useState<{
    pathname: string
    groupId: string | null
  } | null>(null)
  const openGroupId =
    manualOpenGroup?.pathname === pathname ? manualOpenGroup.groupId : activeGroupId

  const PrimaryIcon = primaryItem.icon
  const primaryActive = pathname === primaryItem.href

  return (
    <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r bg-sidebar px-4 py-5 lg:flex lg:flex-col">
      <Link href="/dashboard" className="flex items-center gap-3 px-2 text-foreground">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
          <ListChecks aria-hidden="true" />
        </span>
        <span className="flex flex-col">
          <span className="text-base font-semibold">Clareza Financeira</span>
          <span className="text-xs text-muted-foreground">Sem complicação</span>
        </span>
      </Link>

      <nav className="mt-7 flex flex-col gap-2" aria-label="Navegação principal">
        <Link
          href={primaryItem.href}
          className={cn(
            "flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-medium text-sidebar-foreground outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
            primaryActive
              ? "bg-sidebar-accent text-foreground"
              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
          )}
          aria-current={primaryActive ? "page" : undefined}
        >
          <PrimaryIcon aria-hidden="true" />
          {primaryItem.label}
        </Link>

        <div className="space-y-1.5">
          {navGroups.map((group) => {
            const expanded = openGroupId === group.id
            const groupActive = group.id === activeGroupId
            const GroupIcon = group.icon
            const panelId = `sidebar-group-${group.id}`

            return (
              <section key={group.id} className="space-y-1">
                <button
                  type="button"
                  className={cn(
                    "flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-left text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                    groupActive
                      ? "bg-sidebar-accent/70 text-foreground"
                      : "text-muted-foreground hover:bg-sidebar-accent/70 hover:text-foreground",
                  )}
                  aria-expanded={expanded}
                  aria-controls={panelId}
                  onClick={() =>
                    setManualOpenGroup({
                      pathname,
                      groupId: expanded ? null : group.id,
                    })
                  }
                >
                  <GroupIcon aria-hidden="true" className="size-5 shrink-0" />
                  <span className="min-w-0 flex-1 truncate">{group.label}</span>
                  <ChevronDown
                    aria-hidden="true"
                    className={cn("size-4 shrink-0 transition-transform", expanded && "rotate-180")}
                  />
                </button>

                {expanded && (
                  <div id={panelId} className="ml-5 space-y-1 border-l border-sidebar-border pl-2">
                    {group.items.map((item) => {
                      const active = pathname === item.href
                      const Icon = item.icon

                      return (
                        <Link
                          key={item.href}
                          href={item.href}
                          className={cn(
                            "flex min-h-9 items-center gap-2 rounded-lg px-3 text-sm font-medium outline-none transition-colors focus-visible:ring-3 focus-visible:ring-ring/50",
                            active
                              ? "bg-background text-foreground shadow-sm"
                              : "text-muted-foreground hover:bg-sidebar-accent hover:text-foreground",
                          )}
                          aria-current={active ? "page" : undefined}
                        >
                          <Icon aria-hidden="true" className="size-4 shrink-0" />
                          <span className="min-w-0 truncate">{item.label}</span>
                        </Link>
                      )
                    })}
                  </div>
                )}
              </section>
            )
          })}
        </div>
      </nav>
    </aside>
  )
}
