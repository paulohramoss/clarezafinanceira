"use client"

import { CheckCircle2, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { EmptyState } from "@/components/ui-custom/empty-state"
import type { Bill } from "@/types/finance"

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short" }).format(new Date(`${date}T12:00:00`))
}

function statusLabel(status: Bill["status"]) {
  return {
    pending: "Pendente",
    paid: "Paga",
    overdue: "Vencida",
    canceled: "Cancelada",
  }[status]
}

export function UpcomingBillsCard({
  bills,
  currency,
  onMarkPaid,
}: {
  bills: Bill[]
  currency: string
  onMarkPaid: (bill: Bill) => void
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Próximas contas</CardTitle>
        <CardDescription>As 5 contas mais importantes para acompanhar.</CardDescription>
      </CardHeader>
      <CardContent>
        {bills.length === 0 ? (
          <EmptyState title="Nenhuma conta próxima" description="Quando cadastrar contas, elas aparecem aqui." />
        ) : (
          <div className="flex flex-col gap-3">
            {bills.map((bill) => (
              <div key={bill.id} className="flex flex-col gap-3 rounded-xl border p-3 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-start gap-3">
                  <span className="mt-0.5 flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted">
                    <Clock aria-hidden="true" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate font-medium">{bill.title}</p>
                    <p className="text-sm text-muted-foreground">{formatDate(bill.due_date)}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-3 sm:justify-end">
                  <div className="flex flex-col items-start gap-1 sm:items-end">
                    <MoneyDisplay value={bill.amount} currency={currency} size="sm" tone={bill.type === "receivable" ? "positive" : "default"} />
                    <Badge variant="secondary">{statusLabel(bill.status)}</Badge>
                  </div>
                  {bill.status !== "paid" && (
                    <Button type="button" variant="outline" className="min-h-10" onClick={() => onMarkPaid(bill)}>
                      <CheckCircle2 data-icon="inline-start" />
                      Marcar paga
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
