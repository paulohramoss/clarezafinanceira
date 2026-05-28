import type { FinancialInsight, FinancialSummary } from "@/types/finance"
import { formatCurrency } from "@/lib/finance/format-money"

export function generateFinancialInsights(summary: FinancialSummary): FinancialInsight[] {
  const insights: FinancialInsight[] = []

  const topCategory = summary.spendingByCategory[0]
  if (topCategory) {
    insights.push({
      id: "top-category",
      title: `Você gastou mais com ${topCategory.categoryName}`,
      description: `${formatCurrency(topCategory.amount)} neste mês. Isso representa ${Math.round(topCategory.percentage)}% dos seus gastos.`,
      status: topCategory.percentage > 35 ? "attention" : "ok",
      action: "Veja se esse gasto combina com sua prioridade do mês.",
    })
  }

  const delivery = summary.spendingByCategory.find((item) => item.categoryName === "Delivery")
  if (delivery && delivery.amount > 250) {
    insights.push({
      id: "delivery",
      title: "Delivery apareceu bastante",
      description: `Foram ${formatCurrency(delivery.amount)} em delivery. Pequenas trocas durante a semana podem aliviar.`,
      status: "attention",
      action: "Defina um limite simples para os próximos dias.",
    })
  }

  if (summary.recurringSubscriptions.length > 0) {
    insights.push({
      id: "subscriptions",
      title: `Você tem ${summary.recurringSubscriptions.length} gasto recorrente cadastrado`,
      description: "Assinaturas pequenas somadas podem pesar. Revise o que ainda faz sentido manter.",
      status: "attention",
    })
  }

  if (summary.upcomingBillsTotal > 0) {
    insights.push({
      id: "upcoming-bills",
      title: "Próximas contas no radar",
      description: `Suas próximas contas pendentes somam ${formatCurrency(summary.upcomingBillsTotal)}.`,
      status: summary.upcomingBillsTotal > summary.availableBalance * 0.5 ? "risk" : "ok",
    })
  }

  if (summary.safeToSpend.status === "danger" || summary.safeToSpend.status === "risk") {
    insights.push({
      id: "safe-to-spend",
      title: "Seu saldo pode apertar",
      description: summary.safeToSpend.explanation,
      status: summary.safeToSpend.status,
      action: "Segure compras não essenciais até as contas principais passarem.",
    })
  }

  if (summary.resultThisMonth > 0) {
    insights.push({
      id: "saved-this-month",
      title: "Sobrou dinheiro neste mês",
      description: `Até agora sobraram ${formatCurrency(summary.resultThisMonth)} entre entradas e saídas.`,
      status: "ok",
      action: "Você pode direcionar parte disso para uma meta cadastrada.",
    })
  }

  return insights.slice(0, 6)
}
