import Link from "next/link"
import { ArrowRight, ChartNoAxesCombined, Repeat2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import { cn } from "@/lib/utils"
import type { FinancialSummary } from "@/types/finance"

export function SpendingFocusCard({ summary, currency }: { summary: FinancialSummary; currency: string }) {
  const topCategory = summary.spendingByCategory[0]
  const status = topCategory && topCategory.percentage > 35 ? "attention" : "ok"

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ChartNoAxesCombined aria-hidden="true" />
              Onde olhar primeiro
            </CardTitle>
            <CardDescription>Um ponto de gasto para revisar sem complicar.</CardDescription>
          </div>
          <StatusBadge status={status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {topCategory ? (
          <div className="rounded-lg border bg-background p-4">
            <p className="text-sm text-muted-foreground">Maior gasto do mês</p>
            <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-lg font-semibold">{topCategory.categoryName}</p>
                <p className="text-sm text-muted-foreground">
                  {Math.round(topCategory.percentage)}% de tudo que saiu.
                </p>
              </div>
              <MoneyDisplay value={topCategory.amount} currency={currency} size="lg" tone="negative" />
            </div>
          </div>
        ) : (
          <div className="rounded-lg border bg-background p-4">
            <p className="font-semibold">Ainda não há gastos no mês</p>
            <p className="mt-1 text-sm leading-6 text-muted-foreground">
              Cadastre algumas transações para o sistema mostrar onde revisar primeiro.
            </p>
          </div>
        )}

        <div className="rounded-lg bg-muted p-4">
          <p className="flex items-center gap-2 text-sm font-medium">
            <Repeat2 aria-hidden="true" />
            Assinaturas
          </p>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            {summary.subscriptionSummary.alertText}
          </p>
        </div>

        <Link
          href="/relatorios"
          className={cn(buttonVariants({ variant: "outline" }), "min-h-12 w-full text-base sm:w-fit")}
        >
          Ver relatórios
          <ArrowRight data-icon="inline-end" />
        </Link>
      </CardContent>
    </Card>
  )
}
