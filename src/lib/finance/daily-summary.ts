import type { Bill, DailySummary, FinancialSummary } from "@/types/finance"
import { formatCurrency } from "@/lib/finance/format-money"
import { nextFriday, toLocalDate } from "@/lib/finance/date-utils"

export function getDailySummary(
  summary: Pick<FinancialSummary, "availableBalance" | "safeToSpend">,
  bills: Bill[],
  currency = "BRL",
  today = new Date(),
): DailySummary {
  const friday = nextFriday(today)
  const billsUntilFriday = bills
    .filter((bill) => bill.type === "payable" && bill.status === "pending")
    .filter((bill) => {
      const dueDate = toLocalDate(bill.due_date)
      return dueDate >= toLocalDate(today) && dueDate <= friday
    })
    .reduce((sum, bill) => sum + bill.amount, 0)

  return {
    availableToday: summary.availableBalance,
    billsUntilFriday,
    safePerDay: summary.safeToSpend.safePerDay,
    status: summary.safeToSpend.status,
    text: `Hoje você tem ${formatCurrency(summary.availableBalance, currency)} disponíveis. Existem ${formatCurrency(billsUntilFriday, currency)} em contas até sexta-feira. Para não se apertar, tente gastar no máximo ${formatCurrency(summary.safeToSpend.safePerDay, currency)} por dia.`,
  }
}
