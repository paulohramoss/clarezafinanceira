"use client"

import { Landmark, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { EmptyState } from "@/components/ui-custom/empty-state"
import { formatPercent } from "@/lib/finance/format-money"
import type { Debt } from "@/types/finance"

function statusLabel(status: Debt["status"]) {
  return {
    active: "Ativa",
    paid: "Paga",
    renegotiating: "Renegociando",
  }[status]
}

export function DebtOverview({
  debts,
  currency,
  approximateIncome,
  onEdit,
  onDelete,
}: {
  debts: Debt[]
  currency: string
  approximateIncome: number | null
  onEdit: (debt: Debt) => void
  onDelete: (id: string) => void
}) {
  const activeDebts = debts.filter((debt) => debt.status !== "paid")
  const total = activeDebts.reduce((sum, debt) => sum + debt.current_balance, 0)
  const monthly = activeDebts.reduce((sum, debt) => sum + (debt.monthly_payment ?? 0), 0)
  const ratio = approximateIncome && approximateIncome > 0 ? monthly / approximateIncome : 0

  return (
    <div className="flex flex-col gap-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <Landmark aria-hidden="true" />
              Total em dívidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay value={total} currency={currency} size="xl" tone={total > 0 ? "negative" : "positive"} />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Parcelas mensais</CardTitle>
          </CardHeader>
          <CardContent>
            <MoneyDisplay value={monthly} currency={currency} size="xl" />
          </CardContent>
        </Card>
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-lg">Impacto na renda</CardTitle>
            <CardDescription>
              {approximateIncome ? "Comparando com sua renda aproximada." : "Informe sua renda nas configurações para calcular."}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <span className="text-3xl font-semibold">{formatPercent(ratio)}</span>
            <p className="text-sm leading-6 text-muted-foreground">
              Suas parcelas de dívidas consomem {formatPercent(ratio)} da sua renda mensal.
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Dívidas cadastradas</CardTitle>
          <CardDescription>Orientações gerais: liste tudo, evite novas dívidas e procure renegociação quando necessário.</CardDescription>
        </CardHeader>
        <CardContent>
          {debts.length === 0 ? (
            <EmptyState title="Nenhuma dívida cadastrada" description="Quando cadastrar uma dívida, você verá progresso e impacto mensal aqui." />
          ) : (
            <div className="flex flex-col gap-3">
              {debts.map((debt) => {
                const paid = Math.max(0, debt.original_amount - debt.current_balance)
                const progress = debt.original_amount > 0 ? (paid / debt.original_amount) * 100 : 0
                return (
                  <article key={debt.id} className="flex flex-col gap-4 rounded-xl border p-4">
                    <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">{debt.creditor_name}</h3>
                          <Badge variant="secondary">{statusLabel(debt.status)}</Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">
                          Parcela mensal: {new Intl.NumberFormat("pt-BR", { style: "currency", currency }).format(debt.monthly_payment ?? 0)}
                        </p>
                      </div>
                      <MoneyDisplay value={debt.current_balance} currency={currency} tone="negative" />
                    </div>
                    <div className="flex flex-col gap-2">
                      <div className="flex items-center justify-between text-sm">
                        <span>Progresso de pagamento</span>
                        <span>{Math.round(progress)}%</span>
                      </div>
                      <Progress value={progress} />
                    </div>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <Button type="button" variant="outline" onClick={() => onEdit(debt)}>
                        <Pencil data-icon="inline-start" />
                        Editar
                      </Button>
                      <Button type="button" variant="destructive" onClick={() => onDelete(debt.id)}>
                        <Trash2 data-icon="inline-start" />
                        Excluir
                      </Button>
                    </div>
                  </article>
                )
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
