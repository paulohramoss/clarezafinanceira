import type { FinanceData, FinancialSummary } from "@/types/finance"
import { formatCurrency } from "@/lib/finance/format-money"

function quote(value: unknown) {
  return `"${String(value ?? "").replace(/"/g, '""')}"`
}

export function transactionsToCsv(data: FinanceData) {
  const rows = [
    ["id", "data", "descricao", "valor", "tipo", "categoria", "observacoes"].map(quote).join(","),
    ...data.transactions.map((transaction) => {
      const category = data.categories.find((item) => item.id === transaction.category_id)?.name ?? ""
      return [
        transaction.id,
        transaction.date,
        transaction.description,
        transaction.amount,
        transaction.type,
        category,
        transaction.notes,
      ]
        .map(quote)
        .join(",")
    }),
  ]

  return rows.join("\n")
}

export function simpleFinancialSummaryText(data: FinanceData, summary: FinancialSummary) {
  const currency = data.profile.currency
  return [
    "Clareza Financeira - Resumo simples",
    "",
    summary.dailySummary.text,
    "",
    `Entrou: ${formatCurrency(summary.incomeThisMonth, currency)}`,
    `Saiu: ${formatCurrency(summary.expenseThisMonth, currency)}`,
    `Sobrou/faltou: ${formatCurrency(summary.resultThisMonth, currency)}`,
    `Pode gastar por dia: ${formatCurrency(summary.safeToSpend.safePerDay, currency)}`,
    "",
    `Faça isso agora: ${summary.nextBestAction.title}`,
    summary.nextBestAction.description,
    "",
    "Alertas:",
    ...summary.alerts.slice(0, 6).map((alert) => `- ${alert.title}: ${alert.message}`),
  ].join("\n")
}

export function monthlyReportHtml(data: FinanceData, summary: FinancialSummary) {
  const currency = data.profile.currency
  const report = summary.monthlyReport
  const list = (items: string[]) => items.map((item) => `<li>${item}</li>`).join("")

  return `<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8" />
  <title>Relatório mensal - Clareza Financeira</title>
  <style>
    body { font-family: Arial, sans-serif; color: #102033; margin: 40px; line-height: 1.45; }
    h1, h2 { color: #0a4d86; }
    .grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; }
    .card { border: 1px solid #d8e2ee; border-radius: 12px; padding: 16px; }
    .value { font-size: 24px; font-weight: 700; }
    li { margin-bottom: 6px; }
  </style>
</head>
<body>
  <h1>Relatório mensal simples</h1>
  <p>${report.monthLabel}</p>
  <div class="grid">
    <div class="card"><strong>Entrou</strong><div class="value">${formatCurrency(report.income, currency)}</div></div>
    <div class="card"><strong>Saiu</strong><div class="value">${formatCurrency(report.expense, currency)}</div></div>
    <div class="card"><strong>Sobrou/faltou</strong><div class="value">${formatCurrency(report.result, currency)}</div></div>
  </div>
  <h2>Maiores gastos</h2>
  <ul>${list(report.largestExpenses.map((item) => `${item.description}: ${formatCurrency(item.amount, currency)}`))}</ul>
  <h2>Contas pagas</h2>
  <ul>${list(report.paidBills.map((item) => `${item.title}: ${formatCurrency(item.amount, currency)}`))}</ul>
  <h2>Dívidas</h2>
  <ul>${list(report.debts.map((item) => `${item.creditor_name}: saldo ${formatCurrency(item.current_balance, currency)}`))}</ul>
  <h2>Metas</h2>
  <ul>${list(report.goals.map((item) => `${item.title}: ${formatCurrency(item.current_amount, currency)} de ${formatCurrency(item.target_amount, currency)}`))}</ul>
  <h2>Insights</h2>
  <ul>${list(report.insights.map((item) => `${item.title}: ${item.description}`))}</ul>
  <h2>Recomendações gerais</h2>
  <ul>${list(report.recommendations)}</ul>
</body>
</html>`
}
