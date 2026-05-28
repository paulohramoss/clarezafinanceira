import type { FinanceData, FinancialSummary, NextBestAction } from "@/types/finance"
import { daysBetween } from "@/lib/finance/date-utils"

export function getNextBestAction(data: FinanceData, summary: FinancialSummary): NextBestAction {
  const overdueOrSoon = data.bills
    .filter((bill) => bill.status !== "paid" && bill.status !== "canceled")
    .filter((bill) => daysBetween(bill.due_date) <= 1)
    .sort((a, b) => a.due_date.localeCompare(b.due_date))[0]

  if (overdueOrSoon) {
    const days = daysBetween(overdueOrSoon.due_date)
    return {
      title:
        days < 0
          ? `Resolva ${overdueOrSoon.title}`
          : days === 0
            ? `Pague ${overdueOrSoon.title} hoje`
            : `Pague ${overdueOrSoon.title} amanhã`,
      description: "Essa é a conta mais urgente cadastrada agora.",
      status: days < 0 ? "danger" : "risk",
      href: "/contas",
      cta: "Ver contas",
    }
  }

  const delivery = summary.spendingByCategory.find((item) => item.categoryName === "Delivery")
  if (delivery && delivery.amount >= 250) {
    return {
      title: "Revise seus gastos com delivery",
      description: "Esse gasto está chamando atenção no mês. Uma pausa curta já ajuda.",
      status: "attention",
      href: "/relatorios",
      cta: "Ver relatório",
    }
  }

  if (summary.incomeThisMonth <= 0) {
    return {
      title: "Cadastre sua renda deste mês",
      description: "Sem entrada cadastrada, o sistema não consegue estimar seu mês com precisão.",
      status: "attention",
      href: "/transacoes",
      cta: "Cadastrar entrada",
    }
  }

  const unpaidBill = data.bills.find((bill) => bill.status === "pending")
  if (unpaidBill) {
    return {
      title: `Marque ${unpaidBill.title} como paga se já resolveu`,
      description: "Isso deixa os alertas mais confiáveis.",
      status: "ok",
      href: "/contas",
      cta: "Atualizar contas",
    }
  }

  if (data.goals.length === 0) {
    return {
      title: "Crie uma meta simples",
      description: "Pode ser reserva, viagem, quitar dívida ou estudos.",
      status: "ok",
      href: "/metas",
      cta: "Criar meta",
    }
  }

  return {
    title: "Confira os maiores gastos do mês",
    description: "Olhar poucos itens costuma ser suficiente para decidir o próximo passo.",
    status: summary.monthStatus,
    href: "/relatorios",
    cta: "Ver gastos",
  }
}
