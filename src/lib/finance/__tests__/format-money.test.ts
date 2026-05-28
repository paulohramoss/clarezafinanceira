import { describe, expect, it } from "vitest"
import { formatCurrency, formatPercent, parseMoneyInput } from "@/lib/finance/format-money"

describe("format-money", () => {
  it("formata moeda em portugues do Brasil", () => {
    expect(formatCurrency(1234.56)).toContain("1.234,56")
  })

  it("formata percentual sem depender de casas extras", () => {
    expect(formatPercent(0.265)).toBe("27%")
  })

  it("interpreta valores monetarios comuns de CSV brasileiro", () => {
    expect(parseMoneyInput("R$ 1.234,56")).toBe(1234.56)
    expect(parseMoneyInput("-89,90")).toBe(-89.9)
  })
})
