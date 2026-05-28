import { z } from "zod"

const optionalText = z
  .string()
  .trim()
  .optional()
  .nullable()
  .transform((value) => (value ? value : null))

export const profileSchema = z.object({
  full_name: optionalText,
  visual_mode: z.enum(["simple", "detailed"]),
  font_scale: z.enum(["normal", "large", "extra-large"]).default("normal"),
  help_style: z.enum(["direct", "explanatory", "beginner"]),
  main_goal: optionalText,
  approximate_income: z.coerce.number().min(0, "Informe um valor positivo").nullable().default(null),
  currency: z.string().default("BRL"),
})

export const transactionSchema = z.object({
  type: z.enum(["income", "expense"]),
  description: z.string().trim().min(2, "Descreva a transação"),
  amount: z.coerce.number().positive("Informe um valor maior que zero"),
  category_id: optionalText,
  account_id: optionalText,
  date: z.string().min(8, "Informe a data"),
  payment_method: optionalText,
  notes: optionalText,
  is_recurring: z.boolean().default(false),
  recurrence_type: z.enum(["monthly", "weekly", "yearly"]).nullable().default(null),
})

export const billSchema = z.object({
  type: z.enum(["payable", "receivable"]),
  title: z.string().trim().min(2, "Informe o nome da conta"),
  amount: z.coerce.number().positive("Informe um valor maior que zero"),
  due_date: z.string().min(8, "Informe o vencimento"),
  status: z.enum(["pending", "paid", "overdue", "canceled"]).default("pending"),
  category_id: optionalText,
  notes: optionalText,
  recurring: z.boolean().default(false),
  recurrence_type: z.enum(["monthly", "weekly", "yearly"]).nullable().default(null),
})

export const financialInstitutionSchema = z.object({
  name: z.string().trim().min(2, "Informe o nome da instituição"),
  type: z.enum(["bank", "digital_bank", "wallet", "broker", "credit_union", "other"]),
  display_name: optionalText,
  color: z.string().regex(/^#[0-9a-fA-F]{6}$/, "Escolha uma cor válida").default("#2563eb"),
  notes: optionalText,
  status: z.enum(["active", "inactive"]).default("active"),
})

export const debtSchema = z.object({
  creditor_name: z.string().trim().min(2, "Informe o nome da dívida"),
  original_amount: z.coerce.number().positive("Informe o valor original"),
  current_balance: z.coerce.number().min(0, "Informe o saldo atual"),
  monthly_payment: z.coerce.number().min(0).nullable().default(null),
  due_day: z.coerce.number().int().min(1).max(31).nullable().default(null),
  interest_rate: z.coerce.number().min(0).nullable().default(null),
  status: z.enum(["active", "paid", "renegotiating"]).default("active"),
  notes: optionalText,
})

export const goalSchema = z.object({
  title: z.string().trim().min(2, "Informe o nome da meta"),
  target_amount: z.coerce.number().positive("Informe o valor alvo"),
  current_amount: z.coerce.number().min(0, "Informe um valor positivo").default(0),
  target_date: optionalText,
  category: optionalText,
})

export type ProfileFormValues = z.infer<typeof profileSchema>
export type TransactionFormValues = z.infer<typeof transactionSchema>
export type BillFormValues = z.infer<typeof billSchema>
export type FinancialInstitutionFormValues = z.infer<typeof financialInstitutionSchema>
export type DebtFormValues = z.infer<typeof debtSchema>
export type GoalFormValues = z.infer<typeof goalSchema>
