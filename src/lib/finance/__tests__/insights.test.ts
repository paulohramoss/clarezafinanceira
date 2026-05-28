import { describe, expect, it } from "vitest"
import { createDemoFinanceData } from "@/lib/demo-data"
import { generateFinancialInsights } from "@/lib/finance/insights"
import { getFinancialSummary } from "@/lib/finance/summary"

describe("generateFinancialInsights", () => {
  it("gera insights praticos a partir do resumo financeiro", () => {
    const summary = getFinancialSummary(createDemoFinanceData())
    const insights = generateFinancialInsights(summary)

    expect(insights.length).toBeGreaterThan(0)
    expect(insights.some((insight) => insight.id === "top-category")).toBe(true)
    expect(insights.every((insight) => insight.title.length > 0)).toBe(true)
  })
})
