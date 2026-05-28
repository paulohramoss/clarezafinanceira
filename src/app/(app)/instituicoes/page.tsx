"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { FinancialInstitutionForm } from "@/components/institutions/financial-institution-form"
import { FinancialInstitutionList } from "@/components/institutions/financial-institution-list"
import { PageTitle } from "@/components/layout/page-title"
import { useFinance } from "@/components/providers/finance-provider"
import type { FinancialInstitution } from "@/types/finance"

export default function InstitutionsPage() {
  const { data, addInstitution, updateInstitution, deleteInstitution } = useFinance()
  const [editing, setEditing] = useState<FinancialInstitution | null>(null)

  const institutions = useMemo(
    () => [...data.institutions].sort((a, b) => a.name.localeCompare(b.name)),
    [data.institutions],
  )
  const activeCount = institutions.filter((institution) => institution.status === "active").length

  return (
    <>
      <PageTitle
        title="Instituições"
        description="Cadastre os bancos, carteiras digitais e corretoras que o cliente usa no dia a dia."
      />

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Total cadastrado</p>
          <p className="mt-2 text-3xl font-semibold">{institutions.length}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Ativas</p>
          <p className="mt-2 text-3xl font-semibold text-emerald-700">{activeCount}</p>
        </div>
        <div className="rounded-2xl border bg-card p-4 shadow-sm">
          <p className="text-sm text-muted-foreground">Inativas</p>
          <p className="mt-2 text-3xl font-semibold">{institutions.length - activeCount}</p>
        </div>
      </div>

      <FinancialInstitutionForm
        initial={editing}
        onCancelEdit={() => setEditing(null)}
        onSubmit={async (values) => {
          if (editing) {
            await updateInstitution({ ...editing, ...values })
            setEditing(null)
            toast.success("Instituição atualizada")
            return
          }

          await addInstitution(values)
          toast.success("Instituição criada")
        }}
      />

      <FinancialInstitutionList
        institutions={institutions}
        onEdit={setEditing}
        onDelete={async (id) => {
          await deleteInstitution(id)
          toast.success("Instituição excluída")
        }}
      />
    </>
  )
}
