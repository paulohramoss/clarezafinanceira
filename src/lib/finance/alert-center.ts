import type { FinanceData, FinancialAlert, FinancialSummary } from "@/types/finance"
import { daysBetween } from "@/lib/finance/date-utils"
import { formatCurrency, formatPercent } from "@/lib/finance/format-money"

export function getFinancialAlerts(
  data: FinanceData,
  summary: Pick<
    FinancialSummary,
    | "availableBalance"
    | "safeToSpend"
    | "debtIncomeRatio"
    | "spendingByCategory"
    | "subscriptionSummary"
    | "upcomingBillsTotal"
    | "resultThisMonth"
  >,
): FinancialAlert[] {
  const alerts: FinancialAlert[] = []
  const currency = data.profile.currency

  data.bills
    .filter((bill) => bill.status !== "paid" && bill.status !== "canceled")
    .forEach((bill) => {
      const days = daysBetween(bill.due_date)
      if (days < 0) {
        alerts.push({
          id: `bill-overdue-${bill.id}`,
          title: "Conta vencida",
          message: `${bill.title} está vencida. Valor: ${formatCurrency(bill.amount, currency)}.`,
          status: "danger",
          priority: 1,
          action: "Marque como paga se já resolveu ou priorize essa conta.",
          type: "bill",
        })
      } else if (days <= 2) {
        alerts.push({
          id: `bill-soon-${bill.id}`,
          title: days === 0 ? "Conta vence hoje" : "Conta vencendo",
          message: `${bill.title} vence ${days === 0 ? "hoje" : days === 1 ? "amanhã" : "em 2 dias"}.`,
          status: days === 0 ? "risk" : "attention",
          priority: 2,
          action: "Confira se há saldo separado para essa conta.",
          type: "bill",
        })
      }
    })

  if (summary.safeToSpend.status === "danger" || summary.safeToSpend.status === "risk") {
    alerts.push({
      id: "balance-risk",
      title: "Risco de ficar negativo",
      message: "As contas próximas podem pesar mais do que o saldo disponível.",
      status: summary.safeToSpend.status,
      priority: 3,
      action: "Segure gastos não essenciais até as contas principais passarem.",
      type: "balance",
    })
  }

  if (summary.availableBalance < Math.max(100, summary.upcomingBillsTotal ?? 0)) {
    alerts.push({
      id: "low-balance",
      title: "Saldo baixo",
      message: `Seu saldo disponível é ${formatCurrency(summary.availableBalance, currency)}.`,
      status: "attention",
      priority: 4,
      action: "Evite novos compromissos até atualizar entradas e contas.",
      type: "balance",
    })
  }

  const topCategory = summary.spendingByCategory[0]
  if (topCategory && topCategory.percentage >= 35) {
    alerts.push({
      id: "high-category-spending",
      title: "Gasto acima da média",
      message: `${topCategory.categoryName} representa ${Math.round(topCategory.percentage)}% dos gastos do mês.`,
      status: "attention",
      priority: 5,
      action: "Revise se esse gasto combina com seu momento.",
      type: "spending",
    })
  }

  if (summary.debtIncomeRatio >= 0.3) {
    alerts.push({
      id: "high-debt",
      title: "Dívida alta",
      message: `Parcelas consomem ${formatPercent(summary.debtIncomeRatio)} da renda mensal informada.`,
      status: "risk",
      priority: 6,
      action: "Liste as dívidas e considere procurar renegociação.",
      type: "debt",
    })
  }

  const stuckGoal = data.goals.find((goal) => goal.current_amount <= 0)
  if (stuckGoal) {
    alerts.push({
      id: `goal-stuck-${stuckGoal.id}`,
      title: "Meta parada",
      message: `${stuckGoal.title} ainda não tem valor guardado.`,
      status: "attention",
      priority: 7,
      action: "Comece com um valor pequeno e possível.",
      type: "goal",
    })
  }

  if (summary.subscriptionSummary.totalMonthly > 0) {
    alerts.push({
      id: "subscriptions-total",
      title: "Assinaturas no mês",
      message: summary.subscriptionSummary.alertText,
      status: summary.subscriptionSummary.totalMonthly >= 200 ? "attention" : "ok",
      priority: 8,
      action: "Cancele o que não usa mais.",
      type: "spending",
    })
  }

  if (alerts.length === 0) {
    alerts.push({
      id: "positive",
      title: "Está tudo certo por enquanto",
      message: "Nenhum alerta importante encontrado com os dados cadastrados.",
      status: summary.resultThisMonth >= 0 ? "ok" : "attention",
      priority: 99,
      action: "Continue acompanhando as próximas contas.",
      type: "positive",
    })
  }

  return alerts.sort((a, b) => a.priority - b.priority)
}
