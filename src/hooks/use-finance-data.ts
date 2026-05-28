"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { toast } from "sonner"
import { createDemoFinanceData, createHydrationFinanceData } from "@/lib/demo-data"
import { getDefaultCategories } from "@/lib/finance/constants"
import { getFinancialSummary } from "@/lib/finance/summary"
import {
  clearFirebaseFinancialData,
  deleteFirebaseAccountDataAndUser,
  deleteFirebaseItem,
  fetchFirebaseFinanceData,
  saveFirebaseProfile,
  upsertFirebaseItem,
  upsertFirebaseItems,
} from "@/lib/firebase/finance-repository"
import type {
  Bill,
  Category,
  Debt,
  FinancialInstitution,
  FinanceData,
  Goal,
  Profile,
  Transaction,
} from "@/types/finance"

const STORAGE_KEY = "clareza-financeira-data-v1"

type TableName = "institutions" | "transactions" | "bills" | "debts" | "goals"
type WritableFinanceItem = FinancialInstitution | Transaction | Bill | Debt | Goal

function withCreatedAt<T>(item: T): T & { created_at: string } {
  const createdAt = (item as { created_at?: string }).created_at
  return { ...item, created_at: createdAt ?? new Date().toISOString() }
}

function normalizeNumber(value: unknown) {
  const number = Number(value)
  return Number.isFinite(number) ? number : 0
}

function customCategories(categories: Category[]) {
  return categories.filter((category) => category.user_id && !category.is_default)
}

function normalizeFinanceData(data: FinanceData): FinanceData {
  const storedData = data as FinanceData & {
    institutions?: FinancialInstitution[]
  }

  return {
    ...storedData,
    profile: {
      ...storedData.profile,
      font_scale: storedData.profile.font_scale ?? "normal",
      approximate_income:
        storedData.profile.approximate_income === null
          ? null
          : normalizeNumber(storedData.profile.approximate_income),
    },
    institutions: (storedData.institutions ?? []).map((institution) => ({
      ...institution,
      display_name: institution.display_name ?? null,
      color: institution.color ?? "#2563eb",
      notes: institution.notes ?? null,
      status: institution.status ?? "active",
    })),
    accounts: storedData.accounts.map((account) => ({
      ...account,
      initial_balance: normalizeNumber(account.initial_balance),
      current_balance: normalizeNumber(account.current_balance),
    })),
    transactions: storedData.transactions.map((transaction) => ({
      ...transaction,
      amount: normalizeNumber(transaction.amount),
    })),
    bills: storedData.bills.map((bill) => ({
      ...bill,
      amount: normalizeNumber(bill.amount),
    })),
    debts: storedData.debts.map((debt) => ({
      ...debt,
      original_amount: normalizeNumber(debt.original_amount),
      current_balance: normalizeNumber(debt.current_balance),
      monthly_payment: debt.monthly_payment === null ? null : normalizeNumber(debt.monthly_payment),
      interest_rate: debt.interest_rate === null ? null : normalizeNumber(debt.interest_rate),
    })),
    goals: storedData.goals.map((goal) => ({
      ...goal,
      target_amount: normalizeNumber(goal.target_amount),
      current_amount: normalizeNumber(goal.current_amount),
    })),
  }
}

function loadLocalData() {
  if (typeof window === "undefined") return createDemoFinanceData()

  const saved = window.localStorage.getItem(STORAGE_KEY)
  if (!saved) return createDemoFinanceData()

  try {
    return normalizeFinanceData(JSON.parse(saved) as FinanceData)
  } catch {
    return createDemoFinanceData()
  }
}

export function useFinanceData() {
  const [data, setData] = useState<FinanceData>(() => createHydrationFinanceData())
  const [isLoading, setIsLoading] = useState(true)
  const [isUsingFirebase, setIsUsingFirebase] = useState(false)

  useEffect(() => {
    let active = true

    async function load() {
      try {
        const remote = await fetchFirebaseFinanceData()
        if (!active) return
        if (remote) {
          setData(normalizeFinanceData(remote))
          setIsUsingFirebase(true)
          return
        }
        setData(loadLocalData())
        setIsUsingFirebase(false)
      } catch (error) {
        if (!active) return
        console.error("Erro ao carregar Firebase", error)
        setData(loadLocalData())
        setIsUsingFirebase(false)
        toast.error("Não consegui carregar seus dados do Firebase. Mantive os dados locais.")
      } finally {
        if (active) setIsLoading(false)
      }
    }

    load()

    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (typeof window !== "undefined" && !isLoading && !isUsingFirebase) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data))
    }
  }, [data, isLoading, isUsingFirebase])

  const summary = useMemo(() => getFinancialSummary(data), [data])

  const persistItem = useCallback(
    async (table: TableName, item: WritableFinanceItem) => {
      if (!isUsingFirebase) return
      await upsertFirebaseItem(table, item)
    },
    [isUsingFirebase],
  )

  const deleteRemote = useCallback(
    async (table: TableName, id: string) => {
      if (!isUsingFirebase) return
      await deleteFirebaseItem(table, id)
    },
    [isUsingFirebase],
  )

  const addInstitution = useCallback(
    async (institution: Omit<FinancialInstitution, "id" | "user_id" | "created_at">) => {
      const item = withCreatedAt({
        ...institution,
        id: crypto.randomUUID(),
        user_id: data.profile.id,
      })
      setData((current) => ({
        ...current,
        institutions: [...current.institutions, item].sort((a, b) => a.name.localeCompare(b.name)),
      }))
      await persistItem("institutions", item)
    },
    [data.profile.id, persistItem],
  )

  const updateInstitution = useCallback(
    async (item: FinancialInstitution) => {
      setData((current) => ({
        ...current,
        institutions: current.institutions
          .map((institution) => (institution.id === item.id ? item : institution))
          .sort((a, b) => a.name.localeCompare(b.name)),
      }))
      await persistItem("institutions", item)
    },
    [persistItem],
  )

  const deleteInstitution = useCallback(
    async (id: string) => {
      setData((current) => ({
        ...current,
        institutions: current.institutions.filter((institution) => institution.id !== id),
      }))
      await deleteRemote("institutions", id)
    },
    [deleteRemote],
  )

  const addTransaction = useCallback(
    async (transaction: Omit<Transaction, "id" | "user_id" | "created_at">) => {
      const item = withCreatedAt({
        ...transaction,
        id: crypto.randomUUID(),
        user_id: data.profile.id,
      })
      setData((current) => ({
        ...current,
        transactions: [item, ...current.transactions],
      }))
      await persistItem("transactions", item)
    },
    [data.profile.id, persistItem],
  )

  const updateTransaction = useCallback(
    async (item: Transaction) => {
      setData((current) => ({
        ...current,
        transactions: current.transactions.map((transaction) =>
          transaction.id === item.id ? item : transaction,
        ),
      }))
      await persistItem("transactions", item)
    },
    [persistItem],
  )

  const deleteTransaction = useCallback(
    async (id: string) => {
      setData((current) => ({
        ...current,
        transactions: current.transactions.filter((transaction) => transaction.id !== id),
      }))
      await deleteRemote("transactions", id)
    },
    [deleteRemote],
  )

  const addBill = useCallback(
    async (bill: Omit<Bill, "id" | "user_id" | "created_at">) => {
      const item = withCreatedAt({ ...bill, id: crypto.randomUUID(), user_id: data.profile.id })
      setData((current) => ({ ...current, bills: [item, ...current.bills] }))
      await persistItem("bills", item)
    },
    [data.profile.id, persistItem],
  )

  const updateBill = useCallback(
    async (item: Bill) => {
      setData((current) => ({
        ...current,
        bills: current.bills.map((bill) => (bill.id === item.id ? item : bill)),
      }))
      await persistItem("bills", item)
    },
    [persistItem],
  )

  const deleteBill = useCallback(
    async (id: string) => {
      setData((current) => ({ ...current, bills: current.bills.filter((bill) => bill.id !== id) }))
      await deleteRemote("bills", id)
    },
    [deleteRemote],
  )

  const addDebt = useCallback(
    async (debt: Omit<Debt, "id" | "user_id" | "created_at">) => {
      const item = withCreatedAt({ ...debt, id: crypto.randomUUID(), user_id: data.profile.id })
      setData((current) => ({ ...current, debts: [item, ...current.debts] }))
      await persistItem("debts", item)
    },
    [data.profile.id, persistItem],
  )

  const updateDebt = useCallback(
    async (item: Debt) => {
      setData((current) => ({
        ...current,
        debts: current.debts.map((debt) => (debt.id === item.id ? item : debt)),
      }))
      await persistItem("debts", item)
    },
    [persistItem],
  )

  const deleteDebt = useCallback(
    async (id: string) => {
      setData((current) => ({ ...current, debts: current.debts.filter((debt) => debt.id !== id) }))
      await deleteRemote("debts", id)
    },
    [deleteRemote],
  )

  const addGoal = useCallback(
    async (goal: Omit<Goal, "id" | "user_id" | "created_at">) => {
      const item = withCreatedAt({ ...goal, id: crypto.randomUUID(), user_id: data.profile.id })
      setData((current) => ({ ...current, goals: [item, ...current.goals] }))
      await persistItem("goals", item)
    },
    [data.profile.id, persistItem],
  )

  const updateGoal = useCallback(
    async (item: Goal) => {
      setData((current) => ({
        ...current,
        goals: current.goals.map((goal) => (goal.id === item.id ? item : goal)),
      }))
      await persistItem("goals", item)
    },
    [persistItem],
  )

  const deleteGoal = useCallback(
    async (id: string) => {
      setData((current) => ({ ...current, goals: current.goals.filter((goal) => goal.id !== id) }))
      await deleteRemote("goals", id)
    },
    [deleteRemote],
  )

  const updateProfile = useCallback(
    async (profile: Profile) => {
      setData((current) => ({ ...current, profile }))
      if (isUsingFirebase) await saveFirebaseProfile(profile)
    },
    [isUsingFirebase],
  )

  const importTransactions = useCallback(
    async (transactions: Transaction[]) => {
      setData((current) => ({
        ...current,
        transactions: [...transactions, ...current.transactions],
      }))
      if (isUsingFirebase && transactions.length) {
        await upsertFirebaseItems("transactions", transactions)
      }
    },
    [isUsingFirebase],
  )

  const resetDemo = useCallback(() => {
    const demo = createDemoFinanceData()
    setData(demo)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(demo))
    }
    setIsUsingFirebase(false)
  }, [])

  const clearLocalData = useCallback(() => {
    const empty = createDemoFinanceData()
    empty.transactions = []
    empty.bills = []
    empty.debts = []
    empty.goals = []
    empty.institutions = []
    empty.accounts = [
      {
        id: "acc-local",
        user_id: empty.profile.id,
        name: "Conta principal",
        type: "checking",
        initial_balance: 0,
        current_balance: 0,
      },
    ]
    empty.profile = { ...empty.profile, font_scale: "normal" }
    setData(empty)
    setIsUsingFirebase(false)
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(empty))
    }
  }, [])

  const clearFinancialData = useCallback(async () => {
    if (isUsingFirebase) await clearFirebaseFinancialData()

    const empty = createDemoFinanceData()
    const nextData: FinanceData = {
      ...empty,
      profile: data.profile,
      accounts: [
        {
          id: "acc-local",
          user_id: data.profile.id,
          name: "Conta principal",
          type: "checking",
          initial_balance: 0,
          current_balance: 0,
        },
      ],
      transactions: [],
      bills: [],
      debts: [],
      goals: [],
      institutions: [],
      categories: getDefaultCategories(data.profile.id),
    }
    setData(nextData)
    if (typeof window !== "undefined" && !isUsingFirebase) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
    }
  }, [data.profile, isUsingFirebase])

  const anonymizeFinancialData = useCallback(async () => {
    const nextData: FinanceData = {
      ...data,
      institutions: data.institutions.map((institution, index) => ({
        ...institution,
        name: `Instituição ${index + 1}`,
        display_name: institution.display_name ? `Apelido ${index + 1}` : null,
        notes: institution.notes ? "Texto removido por anonimização" : null,
      })),
      accounts: data.accounts.map((account, index) => ({ ...account, name: `Conta ${index + 1}` })),
      categories: data.categories.map((category, index) =>
        category.is_default ? category : { ...category, name: `Categoria ${index + 1}` },
      ),
      transactions: data.transactions.map((transaction, index) => ({
        ...transaction,
        description: `Transação ${index + 1}`,
        payment_method: transaction.payment_method ? "Não informado" : null,
        notes: transaction.notes ? "Texto removido por anonimização" : null,
      })),
      bills: data.bills.map((bill, index) => ({
        ...bill,
        title: `Conta ${index + 1}`,
        notes: bill.notes ? "Texto removido por anonimização" : null,
      })),
      debts: data.debts.map((debt, index) => ({
        ...debt,
        creditor_name: `Credor ${index + 1}`,
        notes: debt.notes ? "Texto removido por anonimização" : null,
      })),
      goals: data.goals.map((goal, index) => ({
        ...goal,
        title: `Meta ${index + 1}`,
      })),
    }

    if (isUsingFirebase) {
      await upsertFirebaseItems("institutions", nextData.institutions)
      await upsertFirebaseItems("accounts", nextData.accounts)
      await upsertFirebaseItems("categories", customCategories(nextData.categories))
      await upsertFirebaseItems("transactions", nextData.transactions)
      await upsertFirebaseItems("bills", nextData.bills)
      await upsertFirebaseItems("debts", nextData.debts)
      await upsertFirebaseItems("goals", nextData.goals)
    }

    setData(nextData)
    if (typeof window !== "undefined" && !isUsingFirebase) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextData))
    }
  }, [data, isUsingFirebase])

  const deleteAccount = useCallback(async () => {
    if (isUsingFirebase) {
      const deleted = await deleteFirebaseAccountDataAndUser()
      if (deleted) {
        clearLocalData()
        return
      }
    }

    clearLocalData()
  }, [clearLocalData, isUsingFirebase])

  return {
    data,
    setData,
    summary,
    isLoading,
    isUsingFirebase,
    addInstitution,
    updateInstitution,
    deleteInstitution,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    addBill,
    updateBill,
    deleteBill,
    addDebt,
    updateDebt,
    deleteDebt,
    addGoal,
    updateGoal,
    deleteGoal,
    updateProfile,
    importTransactions,
    resetDemo,
    clearLocalData,
    clearFinancialData,
    anonymizeFinancialData,
    deleteAccount,
  }
}
