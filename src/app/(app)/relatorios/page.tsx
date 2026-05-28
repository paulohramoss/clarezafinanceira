"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTitle } from "@/components/layout/page-title"
import { BalanceEvolutionChart } from "@/components/reports/balance-evolution-chart"
import { IncomeExpenseChart } from "@/components/reports/income-expense-chart"
import { SpendingByCategoryChart } from "@/components/reports/spending-by-category-chart"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { useFinance } from "@/components/providers/finance-provider"

export default function ReportsPage() {
  const { data, summary } = useFinance()
  const currency = data.profile.currency

  return (
    <>
      <PageTitle
        title="Relatórios"
        description="Relatórios simples para entender padrões sem precisar decifrar termos difíceis."
      />

      <section className="grid gap-4 xl:grid-cols-2">
        <SpendingByCategoryChart data={summary.spendingByCategory} currency={currency} />
        <IncomeExpenseChart data={summary.incomeExpenseByMonth} currency={currency} />
      </section>

      <BalanceEvolutionChart data={summary.balanceEvolution} currency={currency} />

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Relatório mensal simples</CardTitle>
          <CardDescription>Uma leitura direta do mês, sem termos difíceis.</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-lg border bg-background p-4">
              <p className="text-sm text-muted-foreground">Entrou</p>
              <MoneyDisplay value={summary.monthlyReport.income} currency={currency} size="lg" tone="positive" />
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="text-sm text-muted-foreground">Saiu</p>
              <MoneyDisplay value={summary.monthlyReport.expense} currency={currency} size="lg" tone="negative" />
            </div>
            <div className="rounded-lg border bg-background p-4">
              <p className="text-sm text-muted-foreground">Sobrou/faltou</p>
              <MoneyDisplay
                value={summary.monthlyReport.result}
                currency={currency}
                size="lg"
                tone={summary.monthlyReport.result >= 0 ? "positive" : "negative"}
              />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg border bg-background p-4">
              <h3 className="font-semibold">Insights</h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                {summary.monthlyReport.insights.slice(0, 4).map((item) => (
                  <li key={item.id}>{item.title}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-lg border bg-background p-4">
              <h3 className="font-semibold">Recomendações gerais</h3>
              <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                {summary.monthlyReport.recommendations.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Maiores gastos do mês</CardTitle>
            <CardDescription>Comece olhando para poucos itens. É mais fácil decidir.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {summary.largestExpenses.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                <div className="min-w-0">
                  <p className="truncate font-medium">{transaction.description}</p>
                  <p className="text-sm text-muted-foreground">{transaction.date}</p>
                </div>
                <MoneyDisplay value={transaction.amount} currency={currency} size="sm" tone="negative" />
              </div>
            ))}
            {summary.largestExpenses.length === 0 && (
              <p className="text-sm text-muted-foreground">Sem gastos cadastrados neste mês.</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Assinaturas recorrentes</CardTitle>
            <CardDescription>Gastos pequenos que voltam todo mês.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {summary.subscriptionSummary.items.map((transaction) => (
              <div key={transaction.id} className="flex items-center justify-between gap-3 rounded-xl border p-3">
                <span className="font-medium">{transaction.name}</span>
                <Badge variant="secondary">
                  {new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(transaction.amount)}
                </Badge>
              </div>
            ))}
            {summary.subscriptionSummary.items.length === 0 && (
              <p className="text-sm text-muted-foreground">Nenhuma assinatura recorrente cadastrada.</p>
            )}
          </CardContent>
        </Card>
      </section>
    </>
  )
}
