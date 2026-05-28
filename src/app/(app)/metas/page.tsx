"use client"

import { useState } from "react"
import { toast } from "sonner"
import { PageTitle } from "@/components/layout/page-title"
import { GoalForm } from "@/components/goals/goal-form"
import { GoalCard } from "@/components/goals/goal-card"
import { EmptyState } from "@/components/ui-custom/empty-state"
import { useFinance } from "@/components/providers/finance-provider"
import type { Goal } from "@/types/finance"

export default function GoalsPage() {
  const { data, addGoal, updateGoal, deleteGoal } = useFinance()
  const [editing, setEditing] = useState<Goal | null>(null)

  return (
    <>
      <PageTitle
        title="Metas"
        description="Transforme objetivos em valores simples de acompanhar mês a mês."
      />
      <GoalForm
        initial={editing}
        onCancelEdit={() => setEditing(null)}
        onSubmit={async (values) => {
          if (editing) {
            await updateGoal({ ...editing, ...values })
            setEditing(null)
            toast.success("Meta atualizada")
          } else {
            await addGoal(values)
            toast.success("Meta criada")
          }
        }}
      />
      {data.goals.length === 0 ? (
        <EmptyState title="Nenhuma meta ainda" description="Crie uma meta para visualizar progresso e contribuição mensal sugerida." />
      ) : (
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {data.goals.map((goal) => (
            <GoalCard
              key={goal.id}
              goal={goal}
              currency={data.profile.currency}
              onEdit={setEditing}
              onDelete={async (id) => {
                await deleteGoal(id)
                toast.success("Meta excluída")
              }}
            />
          ))}
        </section>
      )}
    </>
  )
}
