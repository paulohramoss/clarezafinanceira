import { ArrowDownCircle, ArrowUpCircle, EqualApproximately, WalletCards } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import type { FinancialSummary } from "@/types/finance"

type FinancialOverviewCardProps = {
  summary: FinancialSummary
  currency: string
}

export function FinancialOverviewCard({ summary, currency }: FinancialOverviewCardProps) {
  const items = [
    { label: "Saldo disponível", value: summary.availableBalance, icon: WalletCards, tone: "default" as const },
    { label: "Entrou", value: summary.incomeThisMonth, icon: ArrowUpCircle, tone: "positive" as const },
    { label: "Saiu", value: summary.expenseThisMonth, icon: ArrowDownCircle, tone: "negative" as const },
    {
      label: "Sobrou",
      value: summary.resultThisMonth,
      icon: EqualApproximately,
      tone: summary.resultThisMonth >= 0 ? ("positive" as const) : ("negative" as const),
    },
  ]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader className="gap-3">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-xl">Sua situação agora</CardTitle>
            <CardDescription>O básico para entender seu mês em poucos segundos.</CardDescription>
          </div>
          <StatusBadge status={summary.monthStatus} label={summary.monthStatusLabel} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon
            return (
              <div key={item.label} className="flex min-h-28 min-w-0 flex-col justify-between overflow-hidden rounded-xl border bg-background p-4">
                <div className="flex min-w-0 items-center gap-2 text-sm text-muted-foreground">
                  <Icon aria-hidden="true" />
                  <span className="min-w-0 text-wrap">{item.label}</span>
                </div>
                <MoneyDisplay value={item.value} currency={currency} tone={item.tone} size="lg" />
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}
