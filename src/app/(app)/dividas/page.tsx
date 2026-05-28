"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PageTitle } from "@/components/layout/page-title"
import { DebtForm } from "@/components/debts/debt-form"
import { DebtOverview } from "@/components/debts/debt-overview"
import { useFinance } from "@/components/providers/finance-provider"
import type { Debt } from "@/types/finance"

export default function DebtsPage() {
  const { data, addDebt, updateDebt, deleteDebt } = useFinance()
  const [editing, setEditing] = useState<Debt | null>(null)

  return (
    <>
      <PageTitle
        title="Dívidas"
        description="Veja quanto falta, quanto paga por mês e se as parcelas estão pesando na renda."
      />
      <DebtForm
        initial={editing}
        onCancelEdit={() => setEditing(null)}
        onSubmit={async (values) => {
          if (editing) {
            await updateDebt({ ...editing, ...values })
            setEditing(null)
            toast.success("Dívida atualizada")
          } else {
            await addDebt(values)
            toast.success("Dívida cadastrada")
          }
        }}
      />
      <DebtOverview
        debts={data.debts}
        currency={data.profile.currency}
        approximateIncome={data.profile.approximate_income}
        onEdit={setEditing}
        onDelete={async (id) => {
          await deleteDebt(id)
          toast.success("Dívida excluída")
        }}
      />
    </>
  )
}
