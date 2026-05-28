"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { PageTitle } from "@/components/layout/page-title"
import {
  defaultTransactionFilters,
  TransactionFilters,
  type TransactionFiltersState,
} from "@/components/transactions/transaction-filters"
import { TransactionForm } from "@/components/transactions/transaction-form"
import { TransactionList } from "@/components/transactions/transaction-list"
import { useFinance } from "@/components/providers/finance-provider"
import type { Transaction } from "@/types/finance"

export default function TransactionsPage() {
  const { data, addTransaction, updateTransaction, deleteTransaction } = useFinance()
  const [editing, setEditing] = useState<Transaction | null>(null)
  const [filters, setFilters] = useState<TransactionFiltersState>(defaultTransactionFilters)

  const filtered = useMemo(() => {
    return data.transactions
      .filter((transaction) => {
        const matchesSearch = transaction.description.toLowerCase().includes(filters.search.toLowerCase())
        const matchesType = filters.type === "all" || transaction.type === filters.type
        const matchesCategory = filters.categoryId === "all" || transaction.category_id === filters.categoryId
        const matchesStart = !filters.startDate || transaction.date >= filters.startDate
        const matchesEnd = !filters.endDate || transaction.date <= filters.endDate
        return matchesSearch && matchesType && matchesCategory && matchesStart && matchesEnd
      })
      .sort((a, b) => b.date.localeCompare(a.date))
  }, [data.transactions, filters])

  return (
    <>
      <PageTitle
        title="Transações"
        description="Cadastre entradas e saídas com categorias simples. Depois filtre para entender para onde o dinheiro foi."
      />
      <TransactionForm
        categories={data.categories}
        accounts={data.accounts}
        initial={editing}
        onCancelEdit={() => setEditing(null)}
        onSubmit={async (values) => {
          if (editing) {
            await updateTransaction({ ...editing, ...values })
            setEditing(null)
            toast.success("Transação atualizada")
          } else {
            await addTransaction(values)
            toast.success("Transação criada")
          }
        }}
      />
      <TransactionFilters filters={filters} categories={data.categories} onChange={setFilters} />
      <TransactionList
        transactions={filtered}
        categories={data.categories}
        currency={data.profile.currency}
        onEdit={setEditing}
        onDelete={async (id) => {
          await deleteTransaction(id)
          toast.success("Transação excluída")
        }}
      />
    </>
  )
}
