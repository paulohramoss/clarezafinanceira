"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { formatCurrency } from "@/lib/finance/format-money"
import type { Goal } from "@/types/finance"

function monthlySuggestion(goal: Goal, currency: string) {
  if (!goal.target_date) return "Defina uma data para calcular uma sugestão mensal."
  const today = new Date()
  const target = new Date(`${goal.target_date}T12:00:00`)
  const months =
    (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth()) + 1
  const remaining = Math.max(0, goal.target_amount - goal.current_amount)
  const monthly = remaining / Math.max(1, months)
  const formattedDate = new Intl.DateTimeFormat("pt-BR", { month: "2-digit", year: "numeric" }).format(target)
  return `Para atingir essa meta até ${formattedDate}, você precisaria guardar cerca de ${formatCurrency(monthly, currency)} por mês.`
}

export function GoalCard({
  goal,
  currency,
  onEdit,
  onDelete,
}: {
  goal: Goal
  currency: string
  onEdit: (goal: Goal) => void
  onDelete: (id: string) => void
}) {
  const progress = goal.target_amount > 0 ? (goal.current_amount / goal.target_amount) * 100 : 0

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>{goal.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-sm text-muted-foreground">Guardado</p>
            <MoneyDisplay value={goal.current_amount} currency={currency} tone="positive" />
          </div>
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Meta</p>
            <MoneyDisplay value={goal.target_amount} currency={currency} />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between text-sm">
            <span>Progresso</span>
            <span>{Math.min(100, Math.round(progress))}%</span>
          </div>
          <Progress value={Math.min(100, progress)} />
        </div>
        <p className="text-sm leading-6 text-muted-foreground">{monthlySuggestion(goal, currency)}</p>
        <div className="grid grid-cols-2 gap-2">
          <Button type="button" variant="outline" onClick={() => onEdit(goal)}>
            <Pencil data-icon="inline-start" />
            Editar
          </Button>
          <Button type="button" variant="destructive" onClick={() => onDelete(goal.id)}>
            <Trash2 data-icon="inline-start" />
            Excluir
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
