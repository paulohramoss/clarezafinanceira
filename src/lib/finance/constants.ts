import type { Category } from "@/types/finance"

export const DEMO_USER_ID = "demo-user"

export const expenseCategories = [
  "Moradia",
  "Alimentação",
  "Mercado",
  "Transporte",
  "Saúde",
  "Educação",
  "Lazer",
  "Delivery",
  "Assinaturas",
  "Compras",
  "Família",
  "Pets",
  "Impostos",
  "Dívidas",
  "Outros",
]

export const incomeCategories = [
  "Salário",
  "Freelance",
  "Venda",
  "Benefício",
  "Reembolso",
  "Investimento/rendimento",
  "Outros",
]

const colors = [
  "#2563eb",
  "#16a34a",
  "#d97706",
  "#dc2626",
  "#7c3aed",
  "#0f766e",
  "#c2410c",
  "#be123c",
  "#4f46e5",
]

function defaultCategoryId(type: "income" | "expense", index: number) {
  const offset = type === "expense" ? index + 1 : index + 101
  return `00000000-0000-4000-8000-${String(offset).padStart(12, "0")}`
}

export function getDefaultCategories(userId: string | null = null): Category[] {
  const expenses = expenseCategories.map((name, index) => ({
    id: defaultCategoryId("expense", index),
    user_id: userId,
    name,
    type: "expense" as const,
    color: colors[index % colors.length],
    icon: null,
    is_default: true,
  }))

  const incomes = incomeCategories.map((name, index) => ({
    id: defaultCategoryId("income", index),
    user_id: userId,
    name,
    type: "income" as const,
    color: colors[(index + 3) % colors.length],
    icon: null,
    is_default: true,
  }))

  return [...expenses, ...incomes]
}
