"use client"

import { CheckCircle2, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { EmptyState } from "@/components/ui-custom/empty-state"
import type { Bill } from "@/types/finance"

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "long" }).format(new Date(`${date}T12:00:00`))
}

function statusLabel(status: Bill["status"]) {
  return {
    pending: "Pendente",
    paid: "Paga/recebida",
    overdue: "Vencida",
    canceled: "Cancelada",
  }[status]
}

export function BillsList({
  bills,
  currency,
  onEdit,
  onDelete,
  onMarkPaid,
}: {
  bills: Bill[]
  currency: string
  onEdit: (bill: Bill) => void
  onDelete: (id: string) => void
  onMarkPaid: (bill: Bill) => void
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Contas cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        {bills.length === 0 ? (
          <EmptyState title="Nenhuma conta cadastrada" description="Cadastre as próximas contas para receber alertas úteis." />
        ) : (
          <div className="flex flex-col gap-3">
            {bills.map((bill) => (
              <article key={bill.id} className="flex flex-col gap-3 rounded-xl border p-4 md:flex-row md:items-center">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="font-semibold">{bill.title}</h3>
                    <Badge variant={bill.type === "payable" ? "secondary" : "outline"}>
                      {bill.type === "payable" ? "A pagar" : "A receber"}
                    </Badge>
                    <Badge variant="secondary">{statusLabel(bill.status)}</Badge>
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">Vence em {formatDate(bill.due_date)}</p>
                </div>
                <MoneyDisplay value={bill.amount} currency={currency} tone={bill.type === "receivable" ? "positive" : "default"} />
                <div className="grid gap-2 sm:grid-cols-3 md:flex">
                  {bill.status !== "paid" && (
                    <Button type="button" variant="outline" onClick={() => onMarkPaid(bill)}>
                      <CheckCircle2 data-icon="inline-start" />
                      {bill.type === "payable" ? "Paguei" : "Recebi"}
                    </Button>
                  )}
                  <Button type="button" variant="outline" onClick={() => onEdit(bill)}>
                    <Pencil data-icon="inline-start" />
                    Editar
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => onDelete(bill.id)}>
                    <Trash2 data-icon="inline-start" />
                    Excluir
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
