import { describe, expect, it } from "vitest"
import { buildTransactionsFromCsvRows, parseCsvFile } from "@/lib/finance/csv-import"
import { getDefaultCategories } from "@/lib/finance/constants"
import type { Transaction } from "@/types/finance"

describe("csv-import", () => {
  it("detecta colunas, tipo por sinal e categoria simples", () => {
    const parsed = parseCsvFile("data,descricao,valor\n2026-05-01,Netflix,\"-39,90\"\n2026-05-02,Salario,3500")
    const categories = getDefaultCategories("u1")

    const result = buildTransactionsFromCsvRows({
      rows: parsed.rows,
      mapping: parsed.suggestedMapping,
      userId: "u1",
      categories,
    })

    expect(parsed.suggestedMapping.date).toBe("data")
    expect(result.transactions[0].type).toBe("expense")
    expect(result.transactions[0].category_id).toBe(categories.find((category) => category.name === "Assinaturas")?.id)
    expect(result.transactions[1].type).toBe("income")
  })

  it("ignora duplicatas ja existentes", () => {
    const categories = getDefaultCategories("u1")
    const existing: Transaction[] = [
      {
        id: "t1",
        user_id: "u1",
        type: "expense",
        description: "Mercado",
        amount: 120,
        category_id: null,
        account_id: null,
        date: "2026-05-01",
        payment_method: null,
        notes: null,
        is_recurring: false,
        recurrence_type: null,
      },
    ]

    const result = buildTransactionsFromCsvRows({
      rows: [{ date: "2026-05-01", description: "Mercado", amount: "-120" }],
      mapping: { date: "date", description: "description", amount: "amount" },
      userId: "u1",
      categories,
      existingTransactions: existing,
    })

    expect(result.duplicateCount).toBe(1)
    expect(result.transactions).toHaveLength(0)
  })
})
