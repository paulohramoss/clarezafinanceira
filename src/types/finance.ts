export type VisualMode = "simple" | "detailed"
export type FontScale = "normal" | "large" | "extra-large"
export type HelpStyle = "direct" | "explanatory" | "beginner"
export type TransactionType = "income" | "expense"
export type BillType = "payable" | "receivable"
export type BillStatus = "pending" | "paid" | "overdue" | "canceled"
export type RecurrenceType = "monthly" | "weekly" | "yearly"
export type DebtStatus = "active" | "paid" | "renegotiating"
export type AlertStatus = "ok" | "attention" | "risk" | "danger"
export type FinancialInstitutionType =
  | "bank"
  | "digital_bank"
  | "wallet"
  | "broker"
  | "credit_union"
  | "other"
export type FinancialInstitutionStatus = "active" | "inactive"

export interface Profile {
  id: string
  full_name: string | null
  visual_mode: VisualMode
  font_scale: FontScale
  help_style: HelpStyle
  main_goal: string | null
  approximate_income: number | null
  currency: string
  created_at?: string
}

export interface Account {
  id: string
  user_id: string
  name: string
  type: string
  initial_balance: number
  current_balance: number
  created_at?: string
}

export interface FinancialInstitution {
  id: string
  user_id: string
  name: string
  type: FinancialInstitutionType
  display_name: string | null
  color: string
  notes: string | null
  status: FinancialInstitutionStatus
  created_at?: string
}

export interface Category {
  id: string
  user_id: string | null
  name: string
  type: TransactionType
  color: string | null
  icon: string | null
  is_default: boolean
  created_at?: string
}

export interface Transaction {
  id: string
  user_id: string
  type: TransactionType
  description: string
  amount: number
  category_id: string | null
  account_id: string | null
  date: string
  payment_method: string | null
  notes: string | null
  is_recurring: boolean
  recurrence_type: RecurrenceType | null
  created_at?: string
}

export interface Bill {
  id: string
  user_id: string
  type: BillType
  title: string
  amount: number
  due_date: string
  status: BillStatus
  category_id: string | null
  notes: string | null
  recurring: boolean
  recurrence_type: RecurrenceType | null
  created_at?: string
}

export interface Debt {
  id: string
  user_id: string
  creditor_name: string
  original_amount: number
  current_balance: number
  monthly_payment: number | null
  due_day: number | null
  interest_rate: number | null
  status: DebtStatus
  notes: string | null
  created_at?: string
}

export interface Goal {
  id: string
  user_id: string
  title: string
  target_amount: number
  current_amount: number
  target_date: string | null
  category: string | null
  created_at?: string
}

export interface AiConversation {
  id: string
  user_id: string
  question: string
  answer: string
  created_at?: string
}

export interface FinanceData {
  profile: Profile
  institutions: FinancialInstitution[]
  accounts: Account[]
  categories: Category[]
  transactions: Transaction[]
  bills: Bill[]
  debts: Debt[]
  goals: Goal[]
}

export interface CategorySpending {
  categoryId: string | null
  categoryName: string
  amount: number
  color: string
  percentage: number
}

export interface MonthlyPoint {
  label: string
  income: number
  expense: number
  balance: number
}

export interface SafeToSpendResult {
  safeTotal: number
  safePerDay: number
  status: AlertStatus
  explanation: string
}

export interface FinancialInsight {
  id: string
  title: string
  description: string
  status: AlertStatus
  action?: string
}

export interface FinancialAlert {
  id: string
  title: string
  message: string
  status: AlertStatus
  priority: number
  action?: string
  type?: "bill" | "spending" | "balance" | "debt" | "goal" | "positive"
}

export interface DailySummary {
  text: string
  availableToday: number
  billsUntilFriday: number
  safePerDay: number
  status: AlertStatus
}

export interface NextBestAction {
  title: string
  description: string
  status: AlertStatus
  href?: string
  cta?: string
}

export interface SubscriptionItem {
  id: string
  name: string
  amount: number
  source: "recurring" | "keyword" | "repeated"
  lastDate: string
  possiblyForgotten: boolean
}

export interface SubscriptionSummary {
  totalMonthly: number
  items: SubscriptionItem[]
  forgotten: SubscriptionItem[]
  alertText: string
}

export interface MonthlySimpleReport {
  monthLabel: string
  income: number
  expense: number
  result: number
  largestExpenses: Transaction[]
  paidBills: Bill[]
  debts: Debt[]
  goals: Goal[]
  insights: FinancialInsight[]
  recommendations: string[]
}

export interface FinancialSummary {
  availableBalance: number
  incomeThisMonth: number
  expenseThisMonth: number
  resultThisMonth: number
  monthStatus: AlertStatus
  monthStatusLabel: string
  upcomingBillsTotal: number
  overdueBillsTotal: number
  debtsTotal: number
  monthlyDebtPayments: number
  debtIncomeRatio: number
  goalsMonthlyTarget: number
  nextBills: Bill[]
  spendingByCategory: CategorySpending[]
  incomeExpenseByMonth: MonthlyPoint[]
  balanceEvolution: MonthlyPoint[]
  largestExpenses: Transaction[]
  recurringSubscriptions: Transaction[]
  subscriptionSummary: SubscriptionSummary
  alerts: FinancialAlert[]
  dailySummary: DailySummary
  nextBestAction: NextBestAction
  monthlyReport: MonthlySimpleReport
  simpleSummary: string
  safeToSpend: SafeToSpendResult
  insights: FinancialInsight[]
  mainAlert: FinancialAlert
}
