"use client"

import { Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import type { Category, TransactionType } from "@/types/finance"

export type TransactionFiltersState = {
  search: string
  type: "all" | TransactionType
  categoryId: string
  minValue: string
  maxValue: string
  startDate: string
  endDate: string
}

export const defaultTransactionFilters: TransactionFiltersState = {
  search: "",
  type: "all",
  categoryId: "all",
  minValue: "",
  maxValue: "",
  startDate: "",
  endDate: "",
}

export function TransactionFilters({
  filters,
  categories,
  onChange,
}: {
  filters: TransactionFiltersState
  categories: Category[]
  onChange: (filters: TransactionFiltersState) => void
}) {
  return (
    <div className="rounded-2xl border bg-card p-4 shadow-sm">
      <div className="grid gap-3 md:grid-cols-3 xl:grid-cols-6">
        <label className="flex flex-col gap-2 md:col-span-2 xl:col-span-2">
          <span className="text-sm font-medium">Buscar</span>
          <span className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
              className="min-h-11 pl-10"
              placeholder="Descrição"
              value={filters.search}
              onChange={(event) => onChange({ ...filters, search: event.target.value })}
            />
          </span>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Tipo</span>
          <Select
            items={[
              { label: "Todos", value: "all" },
              { label: "Entrou", value: "income" },
              { label: "Saiu", value: "expense" },
            ]}
            value={filters.type}
            onValueChange={(value) => onChange({ ...filters, type: value as TransactionFiltersState["type"] })}
          >
            <SelectTrigger className="min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todos</SelectItem>
                <SelectItem value="income">Entrou</SelectItem>
                <SelectItem value="expense">Saiu</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Categoria</span>
          <Select
            items={[{ label: "Todas", value: "all" }, ...categories.map((category) => ({ label: category.name, value: category.id }))]}
            value={filters.categoryId}
            onValueChange={(value) => onChange({ ...filters, categoryId: value ?? "all" })}
          >
            <SelectTrigger className="min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectItem value="all">Todas</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">De</span>
          <Input
            className="min-h-11"
            type="date"
            value={filters.startDate}
            onChange={(event) => onChange({ ...filters, startDate: event.target.value })}
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium">Até</span>
          <Input
            className="min-h-11"
            type="date"
            value={filters.endDate}
            onChange={(event) => onChange({ ...filters, endDate: event.target.value })}
          />
        </label>
      </div>
    </div>
  )
}
