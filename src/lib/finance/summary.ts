import type { Bill, CategorySpending, FinanceData, FinancialSummary, Transaction } from "@/types/finance"
import { getNextBestAction } from "@/lib/finance/actions"
import { getFinancialAlerts } from "@/lib/finance/alert-center"
import { getMainFinancialAlert } from "@/lib/finance/alerts"
import { calculateSafeToSpend } from "@/lib/finance/safe-to-spend"
import { getDailySummary } from "@/lib/finance/daily-summary"
import { generateFinancialInsights } from "@/lib/finance/insights"
import { getMonthlySimpleReport } from "@/lib/finance/monthly-report"
import { getMonthlyReport } from "@/lib/finance/reports"
import { detectSubscriptions } from "@/lib/finance/subscriptions"
import { formatCurrency } from "@/lib/finance/format-money"
import { daysBetween, isSameMonth } from "@/lib/finance/date-utils"

function getMonthStatus(result: number, expense: number, income: number) {
  if (income > 0 && expense > income) {
    return { status: "danger" as const, label: "Você está gastando mais do que recebe" }
  }
  if (result < 0) {
    return { status: "risk" as const, label: "Risco de aperto este mês" }
  }
  if (income > 0 && expense / income > 0.85) {
    return { status: "attention" as const, label: "Atenção aos gastos" }
  }
  return { status: "ok" as const, label: "Você está no controle" }
}

function getSpendingByCategory(data: FinanceData, monthExpenses: Transaction[]): CategorySpending[] {
  const total = monthExpenses.reduce((sum, transaction) => sum + transaction.amount, 0)
  const grouped = new Map<string, CategorySpending>()

  monthExpenses.forEach((transaction) => {
    const category = data.categories.find((item) => item.id === transaction.category_id)
    const key = transaction.category_id ?? "outros"
    const existing = grouped.get(key)
    const amount = (existing?.amount ?? 0) + transaction.amount

    grouped.set(key, {
      categoryId: transaction.category_id,
      categoryName: category?.name ?? "Outros",
      amount,
      color: category?.color ?? "#64748b",
      percentage: total > 0 ? (amount / total) * 100 : 0,
    })
  })

  return [...grouped.values()].sort((a, b) => b.amount - a.amount)
}

function getSimpleSummary(
  data: FinanceData,
  income: number,
  expense: number,
  available: number,
  nextBills: Bill[],
) {
  const billsTotal = nextBills.reduce((sum, bill) => sum + bill.amount, 0)
  return `Você recebeu ${formatCurrency(income, data.profile.currency)} este mês, gastou ${formatCurrency(expense, data.profile.currency)} e ainda tem ${formatCurrency(available, data.profile.currency)} disponíveis. Suas próximas contas somam ${formatCurrency(billsTotal, data.profile.currency)}.`
}

export function getFinancialSummary(data: FinanceData): FinancialSummary {
  const monthTransactions = data.transactions.filter((transaction) => isSameMonth(transaction.date))
  const monthIncome = monthTransactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const monthExpense = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0)
  const accountBalance = data.accounts.reduce((sum, account) => sum + account.current_balance, 0)
  const unassignedTransactionBalance = data.transactions
    .filter((transaction) => !transaction.account_id)
    .reduce(
      (sum, transaction) => sum + (transaction.type === "income" ? transaction.amount : -transaction.amount),
      0,
    )
  const availableBalance = accountBalance + unassignedTransactionBalance
  const resultThisMonth = monthIncome - monthExpense
  const incomeExpenseStatus = getMonthStatus(resultThisMonth, monthExpense, monthIncome)

  const pendingBills = data.bills.filter((bill) => bill.status === "pending")
  const nextBills = pendingBills
    .filter((bill) => daysBetween(bill.due_date) >= -30)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))
    .slice(0, 5)

  const upcomingBillsTotal = pendingBills
    .filter((bill) => bill.type === "payable" && daysBetween(bill.due_date) >= 0)
    .reduce((sum, bill) => sum + bill.amount, 0)

  const overdueBillsTotal = data.bills
    .filter((bill) => bill.status !== "paid" && bill.status !== "canceled" && daysBetween(bill.due_date) < 0)
    .reduce((sum, bill) => sum + bill.amount, 0)

  const debtsTotal = data.debts
    .filter((debt) => debt.status !== "paid")
    .reduce((sum, debt) => sum + debt.current_balance, 0)

  const monthlyDebtPayments = data.debts
    .filter((debt) => debt.status !== "paid")
    .reduce((sum, debt) => sum + (debt.monthly_payment ?? 0), 0)

  const incomeBase = data.profile.approximate_income || monthIncome
  const debtIncomeRatio = incomeBase > 0 ? monthlyDebtPayments / incomeBase : 0

  const goalsMonthlyTarget = data.goals.reduce((sum, goal) => {
    if (!goal.target_date) return sum
    const remaining = Math.max(0, goal.target_amount - goal.current_amount)
    const target = new Date(`${goal.target_date}T12:00:00`)
    const today = new Date()
    const months =
      (target.getFullYear() - today.getFullYear()) * 12 + (target.getMonth() - today.getMonth()) + 1
    return sum + remaining / Math.max(1, months)
  }, 0)

  const safeToSpend = calculateSafeToSpend({
    availableBalance,
    pendingBills,
    debts: data.debts,
    goals: data.goals,
  })
  const status =
    safeToSpend.status === "danger" || safeToSpend.status === "risk"
      ? { status: safeToSpend.status, label: "Risco de aperto este mês" }
      : safeToSpend.status === "attention" && incomeExpenseStatus.status === "ok"
        ? { status: "attention" as const, label: "Atenção aos gastos" }
        : incomeExpenseStatus

  const spendingByCategory = getSpendingByCategory(
    data,
    monthTransactions.filter((transaction) => transaction.type === "expense"),
  )

  const incomeExpenseByMonth = getMonthlyReport(data)
  const balanceEvolution = incomeExpenseByMonth
  const largestExpenses = monthTransactions
    .filter((transaction) => transaction.type === "expense")
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5)
  const recurringSubscriptions = data.transactions.filter(
    (transaction) => transaction.type === "expense" && transaction.is_recurring,
  )
  const subscriptionSummary = detectSubscriptions(data.transactions, data.categories, data.profile.currency)

  const baseSummary: FinancialSummary = {
    availableBalance,
    incomeThisMonth: monthIncome,
    expenseThisMonth: monthExpense,
    resultThisMonth,
    monthStatus: status.status,
    monthStatusLabel: status.label,
    upcomingBillsTotal,
    overdueBillsTotal,
    debtsTotal,
    monthlyDebtPayments,
    debtIncomeRatio,
    goalsMonthlyTarget,
    nextBills,
    spendingByCategory,
    incomeExpenseByMonth,
    balanceEvolution,
    largestExpenses,
    recurringSubscriptions,
    subscriptionSummary,
    alerts: [],
    dailySummary: {
      text: "",
      availableToday: availableBalance,
      billsUntilFriday: 0,
      safePerDay: safeToSpend.safePerDay,
      status: safeToSpend.status,
    },
    nextBestAction: {
      title: "Confira sua situação",
      description: "Veja saldo, contas próximas e maiores gastos.",
      status: status.status,
      href: "/dashboard",
      cta: "Ver dashboard",
    },
    monthlyReport: {
      monthLabel: "",
      income: monthIncome,
      expense: monthExpense,
      result: resultThisMonth,
      largestExpenses,
      paidBills: [],
      debts: data.debts,
      goals: data.goals,
      insights: [],
      recommendations: [],
    },
    simpleSummary: getSimpleSummary(data, monthIncome, monthExpense, availableBalance, nextBills),
    safeToSpend,
    insights: [],
    mainAlert: {
      id: "loading",
      title: "Está tudo certo por enquanto",
      message: "Continue acompanhando suas contas.",
      status: "ok" as const,
      priority: 7,
    },
  }

  const mainAlert = getMainFinancialAlert(data, baseSummary)
  const withMainAlert = { ...baseSummary, mainAlert }
  const insights = generateFinancialInsights(withMainAlert)
  const withInsights = { ...withMainAlert, insights }
  const alerts = getFinancialAlerts(data, withInsights)
  const dailySummary = getDailySummary(withInsights, data.bills, data.profile.currency)
  const monthlyReport = getMonthlySimpleReport(data, insights)
  const withNewFields = { ...withInsights, alerts, dailySummary, monthlyReport }
  const nextBestAction = getNextBestAction(data, withNewFields)

  return { ...withNewFields, nextBestAction }
}
