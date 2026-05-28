import type { FinanceData, MonthlyPoint } from "@/types/finance"

const monthFormatter = new Intl.DateTimeFormat("pt-BR", { month: "short" })

export function getMonthlyReport(data: FinanceData): MonthlyPoint[] {
  const now = new Date()
  const months = Array.from({ length: 6 }, (_, index) => {
    const date = new Date(now.getFullYear(), now.getMonth() - (5 - index), 1)
    return {
      key: `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`,
      label: monthFormatter.format(date).replace(".", ""),
      income: 0,
      expense: 0,
      balance: 0,
    }
  })

  data.transactions.forEach((transaction) => {
    const date = new Date(`${transaction.date}T12:00:00`)
    const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const month = months.find((item) => item.key === key)
    if (!month) return
    month[transaction.type] += transaction.amount
  })

  let running = data.accounts.reduce((sum, account) => sum + account.initial_balance, 0)
  return months.map((month) => {
    running += month.income - month.expense
    return {
      label: month.label,
      income: month.income,
      expense: month.expense,
      balance: running,
    }
  })
}
