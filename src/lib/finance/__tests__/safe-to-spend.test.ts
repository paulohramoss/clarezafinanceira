import { describe, expect, it } from "vitest"
import { calculateSafeToSpend } from "@/lib/finance/safe-to-spend"
import type { Bill, Debt, Goal } from "@/types/finance"

function bill(amount: number, dueDate: string): Bill {
  return {
    id: crypto.randomUUID(),
    user_id: "u1",
    type: "payable",
    title: "Conta",
    amount,
    due_date: dueDate,
    status: "pending",
    category_id: null,
    notes: null,
    recurring: false,
    recurrence_type: null,
  }
}

describe("calculateSafeToSpend", () => {
  it("reserva contas, dividas e metas antes de calcular o gasto seguro", () => {
    const debts: Debt[] = [
      {
        id: "d1",
        user_id: "u1",
        creditor_name: "Banco",
        original_amount: 1000,
        current_balance: 800,
        monthly_payment: 200,
        due_day: 10,
        interest_rate: null,
        status: "active",
        notes: null,
      },
    ]
    const goals: Goal[] = [
      {
        id: "g1",
        user_id: "u1",
        title: "Reserva",
        target_amount: 1200,
        current_amount: 0,
        target_date: "2026-07-31",
        category: "reserva",
      },
    ]

    const result = calculateSafeToSpend({
      availableBalance: 2000,
      pendingBills: [bill(500, "2026-05-28")],
      debts,
      goals,
      today: new Date("2026-05-20T12:00:00"),
    })

    expect(result.safeTotal).toBe(900)
    expect(result.safePerDay).toBe(75)
    expect(result.status).toBe("ok")
  })

  it("marca risco quando o dinheiro nao cobre compromissos", () => {
    const result = calculateSafeToSpend({
      availableBalance: 300,
      pendingBills: [bill(800, "2026-05-28")],
      debts: [],
      goals: [],
      today: new Date("2026-05-20T12:00:00"),
    })

    expect(result.safeTotal).toBe(0)
    expect(result.status).toBe("danger")
  })
})
