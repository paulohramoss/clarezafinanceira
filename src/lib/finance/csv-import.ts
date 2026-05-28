import Papa from "papaparse"
import { z } from "zod"
import type { Category, Transaction, TransactionType } from "@/types/finance"
import { parseMoneyInput } from "@/lib/finance/format-money"

export type CsvColumnMapping = {
  date: string
  description: string
  amount: string
  type?: string
  category?: string
}

export type CsvParsedFile = {
  headers: string[]
  rows: Record<string, unknown>[]
  suggestedMapping: CsvColumnMapping
  errors: string[]
}

export type CsvPreviewRow = {
  id: string
  date: string
  description: string
  amount: number
  type: TransactionType
  categoryName: string
  duplicate: boolean
  error?: string
}

export type CsvImportResult = {
  transactions: Transaction[]
  preview: CsvPreviewRow[]
  errors: string[]
  duplicateCount: number
}

const csvRowSchema = z.object({
  date: z.string().min(8, "Informe a data"),
  description: z.string().min(1, "Informe a descrição"),
  amount: z.union([z.string(), z.number()]),
  type: z.enum(["income", "expense"]),
  category: z.string().optional().nullable(),
})

const columnAliases: Record<keyof CsvColumnMapping, string[]> = {
  date: ["date", "data", "dia", "dt", "lançamento", "lancamento"],
  description: ["description", "descricao", "descrição", "historico", "histórico", "nome", "memo"],
  amount: ["amount", "valor", "value", "preco", "preço", "quantia"],
  type: ["type", "tipo", "entrada_saida", "natureza"],
  category: ["category", "categoria", "grupo"],
}

const categoryKeywords: Record<string, string[]> = {
  Mercado: ["mercado", "supermercado", "hortifruti", "padaria"],
  Delivery: ["ifood", "delivery", "rappi", "uber eats"],
  Transporte: ["uber", "99", "posto", "gasolina", "metro", "metrô", "onibus", "ônibus"],
  Moradia: ["aluguel", "condominio", "condomínio", "energia", "luz", "água", "agua"],
  Saúde: ["farmacia", "farmácia", "medico", "médico", "hospital", "consulta"],
  Assinaturas: ["netflix", "spotify", "icloud", "google", "internet", "celular", "prime", "youtube"],
  Educação: ["curso", "escola", "faculdade", "livro"],
  Lazer: ["cinema", "bar", "restaurante", "show"],
  Compras: ["amazon", "mercadolivre", "loja", "shopping"],
  Salário: ["salario", "salário", "pagamento"],
  Freelance: ["freela", "freelance", "servico", "serviço"],
  Reembolso: ["reembolso", "estorno"],
}

function normalize(value: string) {
  return value
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
}

function findHeader(headers: string[], field: keyof CsvColumnMapping) {
  return (
    headers.find((header) => columnAliases[field].includes(normalize(header))) ??
    headers.find((header) => columnAliases[field].some((alias) => normalize(header).includes(normalize(alias)))) ??
    ""
  )
}

function valueFrom(row: Record<string, unknown>, column?: string) {
  if (!column) return ""
  return String(row[column] ?? "").trim()
}

function detectType(rawAmount: number, rawType?: string): TransactionType {
  const normalizedType = normalize(rawType ?? "")
  if (["income", "entrada", "credito", "crédito", "receita", "recebido"].some((item) => normalizedType.includes(normalize(item)))) {
    return "income"
  }
  if (["expense", "saida", "saída", "debito", "débito", "despesa", "pago"].some((item) => normalizedType.includes(normalize(item)))) {
    return "expense"
  }
  return rawAmount < 0 ? "expense" : "income"
}

function findCategoryId(categories: Category[], name: string | null | undefined, type: TransactionType) {
  if (!name) return null
  return (
    categories.find(
      (category) =>
        category.type === type && normalize(category.name) === normalize(name),
    )?.id ?? null
  )
}

function guessCategory(description: string, categories: Category[], type: TransactionType) {
  const normalized = normalize(description)
  const matchedName = Object.entries(categoryKeywords).find(([, keywords]) =>
    keywords.some((keyword) => normalized.includes(normalize(keyword))),
  )?.[0]
  return findCategoryId(categories, matchedName, type)
}

function duplicateKey(input: Pick<Transaction, "date" | "description" | "amount" | "type">) {
  return `${input.date}|${normalize(input.description)}|${Math.round(input.amount * 100)}|${input.type}`
}

export function parseCsvFile(fileText: string): CsvParsedFile {
  const parsed = Papa.parse<Record<string, unknown>>(fileText, {
    header: true,
    skipEmptyLines: true,
  })
  const rows = parsed.data
  const headers = parsed.meta.fields ?? Object.keys(rows[0] ?? {})

  return {
    headers,
    rows,
    suggestedMapping: {
      date: findHeader(headers, "date"),
      description: findHeader(headers, "description"),
      amount: findHeader(headers, "amount"),
      type: findHeader(headers, "type"),
      category: findHeader(headers, "category"),
    },
    errors: parsed.errors.map((error) => `Linha ${error.row ?? "?"}: ${error.message}`),
  }
}

export function buildTransactionsFromCsvRows({
  rows,
  mapping,
  userId,
  categories,
  existingTransactions = [],
}: {
  rows: Record<string, unknown>[]
  mapping: CsvColumnMapping
  userId: string
  categories: Category[]
  existingTransactions?: Transaction[]
}): CsvImportResult {
  const existingKeys = new Set(existingTransactions.map(duplicateKey))
  const seen = new Set<string>()
  const transactions: Transaction[] = []
  const preview: CsvPreviewRow[] = []
  const errors: string[] = []

  rows.forEach((row, index) => {
    const rawAmount = parseMoneyInput(valueFrom(row, mapping.amount))
    const type = detectType(rawAmount, valueFrom(row, mapping.type))
    const amount = Math.abs(rawAmount)
    const date = valueFrom(row, mapping.date)
    const description = valueFrom(row, mapping.description)
    const categoryText = valueFrom(row, mapping.category)
    const categoryId = findCategoryId(categories, categoryText, type) ?? guessCategory(description, categories, type)
    const categoryName = categories.find((category) => category.id === categoryId)?.name ?? "Outros"
    const key = duplicateKey({ date, description, amount, type })
    const duplicate = existingKeys.has(key) || seen.has(key)
    const id = crypto.randomUUID()

    const rowResult = csvRowSchema.safeParse({
      date,
      description,
      amount,
      type,
      category: categoryText,
    })

    if (!rowResult.success) {
      const error = `Linha ${index + 2}: ${rowResult.error.issues[0]?.message ?? "dados inválidos"}`
      errors.push(error)
      preview.push({ id, date, description, amount, type, categoryName, duplicate, error })
      return
    }

    preview.push({ id, date, description, amount, type, categoryName, duplicate })
    seen.add(key)

    if (duplicate) return

    transactions.push({
      id,
      user_id: userId,
      type,
      description,
      amount,
      category_id: categoryId,
      account_id: null,
      date,
      payment_method: null,
      notes: "Importado por CSV",
      is_recurring: false,
      recurrence_type: null,
    })
  })

  return {
    transactions,
    preview,
    errors,
    duplicateCount: preview.filter((row) => row.duplicate).length,
  }
}

export function parseTransactionsCsv(
  fileText: string,
  userId: string,
  categories: Category[],
  existingTransactions: Transaction[] = [],
): CsvImportResult {
  const parsed = parseCsvFile(fileText)
  return buildTransactionsFromCsvRows({
    rows: parsed.rows,
    mapping: parsed.suggestedMapping,
    userId,
    categories,
    existingTransactions,
  })
}
