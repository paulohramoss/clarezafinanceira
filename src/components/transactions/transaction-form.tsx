"use client"

import { useEffect } from "react"
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { transactionSchema, type TransactionFormValues } from "@/lib/validation/finance-schemas"
import type { Account, Category, Transaction } from "@/types/finance"

type TransactionFormProps = {
  categories: Category[]
  accounts: Account[]
  initial?: Transaction | null
  onSubmit: (values: TransactionFormValues) => Promise<void> | void
  onCancelEdit?: () => void
}

const baseValues: TransactionFormValues = {
  type: "expense",
  description: "",
  amount: 0,
  category_id: null,
  account_id: null,
  date: new Date().toISOString().slice(0, 10),
  payment_method: null,
  notes: null,
  is_recurring: false,
  recurrence_type: null,
}

export function TransactionForm({
  categories,
  accounts,
  initial,
  onSubmit,
  onCancelEdit,
}: TransactionFormProps) {
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema) as Resolver<TransactionFormValues>,
    defaultValues: baseValues,
  })

  const type = useWatch({ control: form.control, name: "type" })
  const isRecurring = useWatch({ control: form.control, name: "is_recurring" })
  const filteredCategories = categories.filter((category) => category.type === type)

  useEffect(() => {
    if (initial) {
      form.reset({
        type: initial.type,
        description: initial.description,
        amount: initial.amount,
        category_id: initial.category_id,
        account_id: initial.account_id,
        date: initial.date,
        payment_method: initial.payment_method,
        notes: initial.notes,
        is_recurring: initial.is_recurring,
        recurrence_type: initial.recurrence_type,
      })
    } else {
      form.reset(baseValues)
    }
  }, [form, initial])

  return (
    <form
      className="rounded-2xl border bg-card p-4 shadow-sm"
      onSubmit={form.handleSubmit(async (values) => {
        await onSubmit(values)
        if (!initial) form.reset(baseValues)
      })}
    >
      <FieldGroup>
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold">{initial ? "Editar transação" : "Nova transação"}</h2>
            <p className="text-sm text-muted-foreground">Registre dinheiro que entrou ou saiu.</p>
          </div>
          {initial && (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancelar edição
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Controller
            control={form.control}
            name="type"
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Tipo</FieldLabel>
                <Select
                  items={[
                    { label: "Saiu", value: "expense" },
                    { label: "Entrou", value: "income" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="expense">Saiu</SelectItem>
                      <SelectItem value="income">Entrou</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FieldError errors={[fieldState.error]} />
              </Field>
            )}
          />

          <Field data-invalid={!!form.formState.errors.description}>
            <FieldLabel htmlFor="description">Descrição</FieldLabel>
            <Input id="description" placeholder="Ex.: Mercado, salário, farmácia" {...form.register("description")} />
            <FieldError errors={[form.formState.errors.description]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.amount}>
            <FieldLabel htmlFor="amount">Valor</FieldLabel>
            <Input id="amount" type="number" step="0.01" inputMode="decimal" {...form.register("amount")} />
            <FieldError errors={[form.formState.errors.amount]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.date}>
            <FieldLabel htmlFor="date">Data</FieldLabel>
            <Input id="date" type="date" {...form.register("date")} />
            <FieldError errors={[form.formState.errors.date]} />
          </Field>

          <Controller
            control={form.control}
            name="category_id"
            render={({ field }) => (
              <Field>
                <FieldLabel>Categoria</FieldLabel>
                <Select
                  items={[{ label: "Sem categoria", value: "none" }, ...filteredCategories.map((category) => ({ label: category.name, value: category.id }))]}
                  value={field.value ?? "none"}
                  onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none">Sem categoria</SelectItem>
                      {filteredCategories.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="account_id"
            render={({ field }) => (
              <Field>
                <FieldLabel>Conta</FieldLabel>
                <Select
                  items={[{ label: "Sem conta", value: "none" }, ...accounts.map((account) => ({ label: account.name, value: account.id }))]}
                  value={field.value ?? "none"}
                  onValueChange={(value) => field.onChange(value === "none" ? null : value)}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="none">Sem conta</SelectItem>
                      {accounts.map((account) => (
                        <SelectItem key={account.id} value={account.id}>
                          {account.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Field>
            <FieldLabel htmlFor="payment_method">Forma de pagamento</FieldLabel>
            <Input id="payment_method" placeholder="Pix, cartão, dinheiro..." {...form.register("payment_method")} />
          </Field>

          <Controller
            control={form.control}
            name="is_recurring"
            render={({ field }) => (
              <Field orientation="horizontal" className="rounded-xl border p-3">
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                <div className="flex flex-col gap-1">
                  <FieldLabel>É recorrente?</FieldLabel>
                  <p className="text-sm text-muted-foreground">Use para assinatura, salário ou conta repetida.</p>
                </div>
              </Field>
            )}
          />

          {isRecurring && (
            <Controller
              control={form.control}
              name="recurrence_type"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Repete quando?</FieldLabel>
                  <Select
                    items={[
                      { label: "Mensal", value: "monthly" },
                      { label: "Semanal", value: "weekly" },
                      { label: "Anual", value: "yearly" },
                    ]}
                    value={field.value ?? "monthly"}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger className="min-h-11 w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectItem value="monthly">Mensal</SelectItem>
                        <SelectItem value="weekly">Semanal</SelectItem>
                        <SelectItem value="yearly">Anual</SelectItem>
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                </Field>
              )}
            />
          )}
        </div>

        <Field>
          <FieldLabel htmlFor="notes">Observações</FieldLabel>
          <Textarea id="notes" placeholder="Algo importante sobre essa transação" {...form.register("notes")} />
        </Field>

        <Button type="submit" className="min-h-12 w-full text-base sm:w-fit">
          {initial ? <Save data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
          {initial ? "Salvar alteração" : "Criar transação"}
        </Button>
      </FieldGroup>
    </form>
  )
}
