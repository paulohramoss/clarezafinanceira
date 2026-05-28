import type { Category, SubscriptionItem, SubscriptionSummary, Transaction } from "@/types/finance"
import { formatCurrency } from "@/lib/finance/format-money"

const subscriptionKeywords = [
  "netflix",
  "spotify",
  "icloud",
  "google",
  "youtube",
  "prime",
  "amazon",
  "academia",
  "internet",
  "celular",
  "vivo",
  "claro",
  "tim",
  "deezer",
  "disney",
  "hbo",
  "max",
  "chatgpt",
  "apple",
  "microsoft",
]

function normalize(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function categoryName(categories: Category[], id: string | null) {
  return categories.find((category) => category.id === id)?.name ?? ""
}

export function detectSubscriptions(
  transactions: Transaction[],
  categories: Category[],
  currency = "BRL",
): SubscriptionSummary {
  const expenses = transactions
    .filter((transaction) => transaction.type === "expense")
    .sort((a, b) => b.date.localeCompare(a.date))

  const repeatedDescriptions = new Map<string, Transaction[]>()
  expenses.forEach((transaction) => {
    const key = normalize(transaction.description).replace(/\d+/g, "").trim()
    if (!key) return
    repeatedDescriptions.set(key, [...(repeatedDescriptions.get(key) ?? []), transaction])
  })

  const items = new Map<string, SubscriptionItem>()

  expenses.forEach((transaction) => {
    const description = normalize(transaction.description)
    const category = normalize(categoryName(categories, transaction.category_id))
    const repeated = repeatedDescriptions.get(description.replace(/\d+/g, "").trim()) ?? []
    const keyword = subscriptionKeywords.find((item) => description.includes(item))
    const isSubscription =
      transaction.is_recurring ||
      category.includes("assinatura") ||
      Boolean(keyword) ||
      repeated.length >= 2

    if (!isSubscription) return

    const key = keyword ?? description.replace(/\d+/g, "").trim()
    const existing = items.get(key)
    const source: SubscriptionItem["source"] = transaction.is_recurring
      ? "recurring"
      : keyword
        ? "keyword"
        : "repeated"

    if (!existing || transaction.date > existing.lastDate) {
      items.set(key, {
        id: transaction.id,
        name: keyword ? keyword.charAt(0).toUpperCase() + keyword.slice(1) : transaction.description,
        amount: transaction.amount,
        source,
        lastDate: transaction.date,
        possiblyForgotten: source !== "recurring" && transaction.amount < 150,
      })
    }
  })

  const list = [...items.values()].sort((a, b) => b.amount - a.amount)
  const totalMonthly = list.reduce((sum, item) => sum + item.amount, 0)
  const forgotten = list.filter((item) => item.possiblyForgotten)

  return {
    totalMonthly,
    items: list,
    forgotten,
    alertText:
      totalMonthly > 0
        ? `Você gasta ${formatCurrency(totalMonthly, currency)}/mês com assinaturas.`
        : "Nenhuma assinatura recorrente encontrada ainda.",
  }
}
