import type { FinancialAlert, FinanceData, FinancialSummary } from "@/types/finance"
import { daysBetween } from "@/lib/finance/date-utils"
import { formatCurrency } from "@/lib/finance/format-money"

export function getMainFinancialAlert(
  data: FinanceData,
  summary: Pick<
    FinancialSummary,
    "availableBalance" | "safeToSpend" | "debtIncomeRatio" | "spendingByCategory" | "resultThisMonth"
  >,
): FinancialAlert {
  const overdue = data.bills
    .filter((bill) => bill.status !== "paid" && bill.status !== "canceled" && daysBetween(bill.due_date) < 0)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))[0]

  if (overdue) {
    return {
      id: "overdue-bill",
      title: "Conta vencida",
      message: `${overdue.title} venceu e ainda está pendente. O valor é ${formatCurrency(overdue.amount, data.profile.currency)}.`,
      status: "danger",
      priority: 1,
      action: "Priorize essa conta ou marque como paga se já resolveu.",
      type: "bill",
    }
  }

  if (summary.safeToSpend.status === "danger" || summary.safeToSpend.status === "risk" || summary.availableBalance < 0) {
    return {
      id: "negative-risk",
      title: "Risco de ficar negativo",
      message: "Seu saldo pode não cobrir as próximas contas. O melhor agora é pausar gastos que não são essenciais.",
      status: summary.safeToSpend.status === "risk" ? "risk" : "danger",
      priority: 2,
      action: "Segure gastos não essenciais até as contas principais passarem.",
      type: "balance",
    }
  }

  const soonHighBill = data.bills
    .filter((bill) => bill.type === "payable" && bill.status === "pending")
    .filter((bill) => daysBetween(bill.due_date) >= 0 && daysBetween(bill.due_date) <= 3)
    .sort((a, b) => b.amount - a.amount)[0]

  if (soonHighBill && soonHighBill.amount > Math.max(250, summary.availableBalance * 0.25)) {
    const days = daysBetween(soonHighBill.due_date)
    return {
      id: "high-bill-soon",
      title: "Conta alta chegando",
      message: `${soonHighBill.title} vence ${days === 0 ? "hoje" : days === 1 ? "amanhã" : `em ${days} dias`} e pesa no seu saldo.`,
      status: "risk",
      priority: 3,
      action: "Confira se você já separou dinheiro para essa conta.",
      type: "bill",
    }
  }

  const delivery = summary.spendingByCategory.find((item) => item.categoryName === "Delivery")
  if (delivery && delivery.amount >= 300) {
    return {
      id: "delivery-growth",
      title: "Gasto com delivery alto",
      message: "Seu gasto com delivery está chamando atenção neste mês. Uma pausa curta já pode aliviar o orçamento.",
      status: "attention",
      priority: 4,
      action: "Defina um limite simples para os próximos dias.",
      type: "spending",
    }
  }

  if (summary.debtIncomeRatio >= 0.3) {
    return {
      id: "debt-income",
      title: "Dívidas pesando",
      message: "Suas parcelas estão consumindo uma parte alta da renda. Vale listar tudo e avaliar renegociação com calma.",
      status: "risk",
      priority: 5,
      action: "Evite novas dívidas e procure renegociação se necessário.",
      type: "debt",
    }
  }

  const lateGoal = data.goals.find((goal) => goal.target_date && goal.current_amount < goal.target_amount * 0.2)
  if (lateGoal) {
    return {
      id: "goal-behind",
      title: "Meta andando devagar",
      message: `${lateGoal.title} ainda está no começo. Guardar um valor pequeno todo mês já ajuda a criar ritmo.`,
      status: "attention",
      priority: 6,
      action: "Comece com um valor pequeno e possível.",
      type: "goal",
    }
  }

  return {
    id: "positive-month",
    title: summary.resultThisMonth >= 0 ? "Está tudo certo por enquanto" : "Atenção ao mês",
    message:
      summary.resultThisMonth >= 0
        ? "Seu mês está positivo. Continue acompanhando as próximas contas."
        : "Você gastou mais do que recebeu neste mês. Vale revisar os maiores gastos.",
    status: summary.resultThisMonth >= 0 ? "ok" : "attention",
    priority: 7,
    action: "Continue acompanhando suas próximas contas.",
    type: "positive",
  }
}
