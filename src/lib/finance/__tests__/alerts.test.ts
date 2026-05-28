import { describe, expect, it } from "vitest"
import { getMainFinancialAlert } from "@/lib/finance/alerts"
import { createDemoFinanceData } from "@/lib/demo-data"
import type { FinancialSummary } from "@/types/finance"

function dateOffset(days: number) {
  const date = new Date()
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + days)
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`
}

function minimalSummary(): Pick<
  FinancialSummary,
  "availableBalance" | "safeToSpend" | "debtIncomeRatio" | "spendingByCategory" | "resultThisMonth"
> {
  return {
    availableBalance: 1000,
    safeToSpend: {
      safeTotal: 500,
      safePerDay: 50,
      status: "attention",
      explanation: "Teste",
    },
    debtIncomeRatio: 0.1,
    spendingByCategory: [],
    resultThisMonth: 100,
  }
}

describe("getMainFinancialAlert", () => {
  it("prioriza conta vencida", () => {
    const data = createDemoFinanceData()
    data.bills = [
      {
        id: "b1",
        user_id: data.profile.id,
        type: "payable",
        title: "Energia",
        amount: 180,
        due_date: dateOffset(-1),
        status: "pending",
        category_id: null,
        notes: null,
        recurring: false,
        recurrence_type: null,
      },
    ]

    const alert = getMainFinancialAlert(data, minimalSummary())

    expect(alert.id).toBe("overdue-bill")
    expect(alert.status).toBe("danger")
  })

  it("alerta risco de saldo negativo antes de sugestoes menores", () => {
    const data = createDemoFinanceData()
    data.bills = []

    const alert = getMainFinancialAlert(data, {
      ...minimalSummary(),
      safeToSpend: {
        safeTotal: 0,
        safePerDay: 0,
        status: "danger",
        explanation: "Teste",
      },
    })

    expect(alert.id).toBe("negative-risk")
  })
})
