import type { FinanceData, FinancialInsight, MonthlySimpleReport, Transaction } from "@/types/finance"
import { isSameMonth, monthLabel } from "@/lib/finance/date-utils"

export function getMonthlySimpleReport(
  data: FinanceData,
  insights: FinancialInsight[],
  today = new Date(),
): MonthlySimpleReport {
  const monthTransactions = data.transactions.filter((transaction) => isSameMonth(transaction.date, today))
  const income = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const expense = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const largestExpenses = monthTransactions
    .filter((transaction): transaction is Transaction => transaction.type === "expense")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)

  const recommendations = [
    "Confira as contas que vencem nos próximos dias.",
    "Revise gastos recorrentes e assinaturas que você não usa.",
    "Evite novas dívidas se o mês estiver apertado.",
    "Use metas pequenas e possíveis para criar constância.",
  ]

  return {
    monthLabel: monthLabel(today),
    income,
    expense,
    result: income - expense,
    largestExpenses,
    paidBills: data.bills.filter((bill) => bill.status === "paid" && isSameMonth(bill.due_date, today)),
    debts: data.debts,
    goals: data.goals,
    insights,
    recommendations,
  }
}
