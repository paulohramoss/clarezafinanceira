import { CalendarCheck2, WalletCards } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import type { DailySummary } from "@/types/finance"

export function DailySummaryCard({ summary, currency }: { summary: DailySummary; currency: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <CalendarCheck2 aria-hidden="true" />
              Resumo de hoje
            </CardTitle>
            <CardDescription>O que importa para decidir seus gastos hoje.</CardDescription>
          </div>
          <StatusBadge status={summary.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <p className="text-base leading-7 text-foreground">{summary.text}</p>
        <div className="grid gap-3 sm:grid-cols-2">
          <div className="min-w-0 overflow-hidden rounded-lg border bg-background p-4">
            <div className="mb-2 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <WalletCards aria-hidden="true" />
              <span className="min-w-0 text-wrap">Disponível hoje</span>
            </div>
            <MoneyDisplay value={summary.availableToday} currency={currency} size="lg" />
          </div>
          <div className="min-w-0 overflow-hidden rounded-lg border bg-background p-4">
            <div className="mb-2 flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
              <CalendarCheck2 aria-hidden="true" />
              <span className="min-w-0 text-wrap">Contas até sexta</span>
            </div>
            <MoneyDisplay value={summary.billsUntilFriday} currency={currency} size="lg" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
