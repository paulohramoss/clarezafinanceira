import Link from "next/link"
import { ArrowRight, BellRing } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import { cn } from "@/lib/utils"
import type { FinancialAlert } from "@/types/finance"

export function AlertCenterPreview({ alerts }: { alerts: FinancialAlert[] }) {
  const visibleAlerts = alerts.slice(0, 3)

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <BellRing aria-hidden="true" />
              Central de alertas
            </CardTitle>
            <CardDescription>Os avisos mais importantes ficam juntos aqui.</CardDescription>
          </div>
          <Link href="/alertas" className={cn(buttonVariants({ variant: "outline" }), "min-h-11")}>
            Ver todos
            <ArrowRight data-icon="inline-end" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="grid gap-3 md:grid-cols-3">
        {visibleAlerts.map((alert) => (
          <article key={alert.id} className="flex flex-col gap-3 rounded-lg border bg-background p-4">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-medium">{alert.title}</h3>
              <StatusBadge status={alert.status} />
            </div>
            <p className="text-sm leading-6 text-muted-foreground">{alert.message}</p>
          </article>
        ))}
      </CardContent>
    </Card>
  )
}
