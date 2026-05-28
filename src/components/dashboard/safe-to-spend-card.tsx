import { CalendarDays } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import type { SafeToSpendResult } from "@/types/finance"

export function SafeToSpendCard({ result, currency }: { result: SafeToSpendResult; currency: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="text-lg">Pode gastar com segurança</CardTitle>
            <CardDescription>Estimativa até o fim do mês.</CardDescription>
          </div>
          <StatusBadge status={result.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-xl bg-[color:var(--cf-info-soft)] p-4 text-[color:var(--cf-info)]">
          <div className="flex items-center gap-2 text-sm font-medium">
            <CalendarDays aria-hidden="true" />
            Por dia
          </div>
          <MoneyDisplay value={result.safePerDay} currency={currency} size="xl" className="text-[color:var(--cf-info)]" />
          <p className="mt-2 text-sm leading-6">
            Você pode gastar até {new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(result.safePerDay)} por dia até o fim do mês.
          </p>
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{result.explanation}</p>
      </CardContent>
    </Card>
  )
}
