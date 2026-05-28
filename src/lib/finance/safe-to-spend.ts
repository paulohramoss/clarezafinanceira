import type { AlertStatus, Bill, Debt, Goal, SafeToSpendResult } from "@/types/finance"

type SafeToSpendInput = {
  availableBalance: number
  pendingBills: Bill[]
  debts: Debt[]
  goals: Goal[]
  expectedIncome?: number
  today?: Date
}

function daysUntilEndOfMonth(today: Date) {
  const end = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  return Math.max(1, end.getDate() - today.getDate() + 1)
}

function getStatus(safeTotal: number, daily: number): AlertStatus {
  if (safeTotal < 0) return "danger"
  if (daily < 25) return "risk"
  if (daily < 60) return "attention"
  return "ok"
}

export function calculateSafeToSpend(input: SafeToSpendInput): SafeToSpendResult {
  const today = input.today ?? new Date()
  const endOfMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0)
  const pendingBillsTotal = input.pendingBills
    .filter((bill) => {
      const dueDate = new Date(`${bill.due_date}T12:00:00`)
      return bill.type === "payable" && bill.status === "pending" && dueDate <= endOfMonth
    })
    .reduce((sum, bill) => sum + bill.amount, 0)

  const monthlyDebts = input.debts
    .filter((debt) => debt.status !== "paid")
    .reduce((sum, debt) => sum + (debt.monthly_payment ?? 0), 0)

  const monthlyGoals = input.goals.reduce((sum, goal) => {
    if (!goal.target_date) return sum
    const remaining = Math.max(0, goal.target_amount - goal.current_amount)
    const target = new Date(`${goal.target_date}T12:00:00`)
    const months =
      (target.getFullYear() - today.getFullYear()) * 12 +
      (target.getMonth() - today.getMonth()) +
      1
    return sum + remaining / Math.max(1, months)
  }, 0)

  const safeTotal =
    input.availableBalance +
    (input.expectedIncome ?? 0) -
    pendingBillsTotal -
    monthlyDebts -
    monthlyGoals

  const safePerDay = safeTotal / daysUntilEndOfMonth(today)
  const status = getStatus(safeTotal, safePerDay)

  const explanation =
    safeTotal >= 0
      ? "Depois de reservar dinheiro para suas próximas contas, dívidas e metas, esse é o valor estimado que você pode usar até o fim do mês."
      : "Com as contas, dívidas e metas cadastradas, seu mês pode ficar negativo. Vale segurar gastos não essenciais agora."

  return {
    safeTotal: Math.max(0, Math.round(safeTotal)),
    safePerDay: Math.max(0, Math.round(safePerDay)),
    status,
    explanation,
  }
}
