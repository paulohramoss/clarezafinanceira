"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { PageTitle } from "@/components/layout/page-title"
import { BillForm } from "@/components/bills/bill-form"
import { BillsList } from "@/components/bills/bills-list"
import { useFinance } from "@/components/providers/finance-provider"
import type { Bill } from "@/types/finance"

type BillFilter = "all" | "overdue" | "today" | "upcoming" | "paid"

function daysBetween(date: string) {
  const due = new Date(`${date}T12:00:00`)
  const now = new Date()
  now.setHours(12, 0, 0, 0)
  return Math.round((due.getTime() - now.getTime()) / 86_400_000)
}

export default function BillsPage() {
  const { data, addBill, updateBill, deleteBill } = useFinance()
  const [editing, setEditing] = useState<Bill | null>(null)
  const [filter, setFilter] = useState<BillFilter>("all")

  const filtered = useMemo(() => {
    return data.bills
      .filter((bill) => {
        const days = daysBetween(bill.due_date)
        if (filter === "paid") return bill.status === "paid"
        if (filter === "overdue") return bill.status !== "paid" && days < 0
        if (filter === "today") return bill.status !== "paid" && days === 0
        if (filter === "upcoming") return bill.status !== "paid" && days > 0
        return true
      })
      .sort((a, b) => a.due_date.localeCompare(b.due_date))
  }, [data.bills, filter])

  const filters: Array<{ value: BillFilter; label: string }> = [
    { value: "all", label: "Todas" },
    { value: "overdue", label: "Vencidas" },
    { value: "today", label: "Hoje" },
    { value: "upcoming", label: "Próximas" },
    { value: "paid", label: "Pagas" },
  ]

  return (
    <>
      <PageTitle
        title="Contas"
        description="Acompanhe contas a pagar e a receber para não ser pego de surpresa."
      />
      <BillForm
        categories={data.categories}
        initial={editing}
        onCancelEdit={() => setEditing(null)}
        onSubmit={async (values) => {
          if (editing) {
            await updateBill({ ...editing, ...values })
            setEditing(null)
            toast.success("Conta atualizada")
          } else {
            await addBill(values)
            toast.success("Conta criada")
          }
        }}
      />
      <div className="flex flex-wrap gap-2 rounded-2xl border bg-card p-3 shadow-sm">
        {filters.map((item) => (
          <Button
            key={item.value}
            type="button"
            variant={filter === item.value ? "default" : "outline"}
            className="min-h-10"
            onClick={() => setFilter(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>
      <BillsList
        bills={filtered}
        currency={data.profile.currency}
        onEdit={setEditing}
        onDelete={async (id) => {
          await deleteBill(id)
          toast.success("Conta excluída")
        }}
        onMarkPaid={async (bill) => {
          await updateBill({ ...bill, status: "paid" })
          toast.success(bill.type === "payable" ? "Conta marcada como paga" : "Conta marcada como recebida")
        }}
      />
    </>
  )
}
