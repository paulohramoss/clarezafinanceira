import type { FinanceData } from "@/types/finance"
import { DEMO_USER_ID, getDefaultCategories } from "@/lib/finance/constants"

const HYDRATION_DEMO_DATE = new Date(2026, 0, 15, 12, 0, 0, 0)

function isoDate(baseDate: Date, offsetDays = 0) {
  const date = new Date(baseDate)
  date.setHours(12, 0, 0, 0)
  date.setDate(date.getDate() + offsetDays)
  return date.toISOString().slice(0, 10)
}

export function createDemoFinanceData(baseDate = new Date()): FinanceData {
  const categories = getDefaultCategories(DEMO_USER_ID)
  const category = (name: string) =>
    categories.find((item) => item.name === name)?.id ?? null

  return {
    profile: {
      id: DEMO_USER_ID,
      full_name: "Pessoa de exemplo",
      visual_mode: "simple",
      font_scale: "normal",
      help_style: "beginner",
      main_goal: "Entender para onde o dinheiro vai",
      approximate_income: 3500,
      currency: "BRL",
    },
    institutions: [
      {
        id: "inst-nubank",
        user_id: DEMO_USER_ID,
        name: "Nubank",
        type: "digital_bank",
        display_name: "Roxinho do dia a dia",
        color: "#7c3aed",
        notes: "Usado para Pix, cartão e gastos do mês.",
        status: "active",
        created_at: isoDate(baseDate, -40),
      },
      {
        id: "inst-banco-brasil",
        user_id: DEMO_USER_ID,
        name: "Banco do Brasil",
        type: "bank",
        display_name: "Conta salário",
        color: "#facc15",
        notes: "Recebimento principal.",
        status: "active",
        created_at: isoDate(baseDate, -120),
      },
    ],
    accounts: [
      {
        id: "acc-principal",
        user_id: DEMO_USER_ID,
        name: "Conta principal",
        type: "checking",
        initial_balance: 900,
        current_balance: 1830,
      },
    ],
    categories,
    transactions: [
      {
        id: "tx-salario",
        user_id: DEMO_USER_ID,
        type: "income",
        description: "Salário",
        amount: 3500,
        category_id: category("Salário"),
        account_id: "acc-principal",
        date: isoDate(baseDate, -18),
        payment_method: "Pix",
        notes: null,
        is_recurring: true,
        recurrence_type: "monthly",
      },
      {
        id: "tx-mercado-1",
        user_id: DEMO_USER_ID,
        type: "expense",
        description: "Mercado do mês",
        amount: 650,
        category_id: category("Mercado"),
        account_id: "acc-principal",
        date: isoDate(baseDate, -13),
        payment_method: "Débito",
        notes: null,
        is_recurring: false,
        recurrence_type: null,
      },
      {
        id: "tx-transporte",
        user_id: DEMO_USER_ID,
        type: "expense",
        description: "Transporte",
        amount: 280,
        category_id: category("Transporte"),
        account_id: "acc-principal",
        date: isoDate(baseDate, -10),
        payment_method: "Cartão",
        notes: null,
        is_recurring: false,
        recurrence_type: null,
      },
      {
        id: "tx-delivery",
        user_id: DEMO_USER_ID,
        type: "expense",
        description: "Delivery",
        amount: 320,
        category_id: category("Delivery"),
        account_id: "acc-principal",
        date: isoDate(baseDate, -7),
        payment_method: "Cartão",
        notes: "Gasto cresceu neste mês",
        is_recurring: false,
        recurrence_type: null,
      },
      {
        id: "tx-internet",
        user_id: DEMO_USER_ID,
        type: "expense",
        description: "Internet",
        amount: 120,
        category_id: category("Assinaturas"),
        account_id: "acc-principal",
        date: isoDate(baseDate, -5),
        payment_method: "Débito automático",
        notes: null,
        is_recurring: true,
        recurrence_type: "monthly",
      },
      {
        id: "tx-cartao",
        user_id: DEMO_USER_ID,
        type: "expense",
        description: "Cartão",
        amount: 700,
        category_id: category("Compras"),
        account_id: "acc-principal",
        date: isoDate(baseDate, -3),
        payment_method: "Cartão",
        notes: null,
        is_recurring: false,
        recurrence_type: null,
      },
    ],
    bills: [
      {
        id: "bill-aluguel",
        user_id: DEMO_USER_ID,
        type: "payable",
        title: "Aluguel",
        amount: 1000,
        due_date: isoDate(baseDate, 2),
        status: "pending",
        category_id: category("Moradia"),
        notes: null,
        recurring: true,
        recurrence_type: "monthly",
      },
      {
        id: "bill-internet",
        user_id: DEMO_USER_ID,
        type: "payable",
        title: "Internet",
        amount: 120,
        due_date: isoDate(baseDate, 5),
        status: "pending",
        category_id: category("Assinaturas"),
        notes: null,
        recurring: true,
        recurrence_type: "monthly",
      },
      {
        id: "bill-freela",
        user_id: DEMO_USER_ID,
        type: "receivable",
        title: "Receber freelance",
        amount: 480,
        due_date: isoDate(baseDate, 7),
        status: "pending",
        category_id: category("Freelance"),
        notes: null,
        recurring: false,
        recurrence_type: null,
      },
    ],
    debts: [
      {
        id: "debt-emprestimo",
        user_id: DEMO_USER_ID,
        creditor_name: "Empréstimo",
        original_amount: 2400,
        current_balance: 1800,
        monthly_payment: 280,
        due_day: 12,
        interest_rate: null,
        status: "active",
        notes: "Renegociar se pesar no mês.",
      },
    ],
    goals: [
      {
        id: "goal-reserva",
        user_id: DEMO_USER_ID,
        title: "Reserva de emergência",
        target_amount: 5000,
        current_amount: 650,
        target_date: "2026-12-31",
        category: "reserva de emergência",
      },
    ],
  }
}

export function createHydrationFinanceData(): FinanceData {
  return createDemoFinanceData(HYDRATION_DEMO_DATE)
}
