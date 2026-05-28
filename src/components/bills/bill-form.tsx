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
import { billSchema, type BillFormValues } from "@/lib/validation/finance-schemas"
import type { Bill, Category } from "@/types/finance"

type BillFormProps = {
  categories: Category[]
  initial?: Bill | null
  onSubmit: (values: BillFormValues) => Promise<void> | void
  onCancelEdit?: () => void
}

const baseValues: BillFormValues = {
  type: "payable",
  title: "",
  amount: 0,
  due_date: new Date().toISOString().slice(0, 10),
  status: "pending",
  category_id: null,
  notes: null,
  recurring: false,
  recurrence_type: null,
}

export function BillForm({ categories, initial, onSubmit, onCancelEdit }: BillFormProps) {
  const form = useForm<BillFormValues>({
    resolver: zodResolver(billSchema) as Resolver<BillFormValues>,
    defaultValues: baseValues,
  })

  const type = useWatch({ control: form.control, name: "type" })
  const recurring = useWatch({ control: form.control, name: "recurring" })
  const categoryType = type === "payable" ? "expense" : "income"
  const filteredCategories = categories.filter((category) => category.type === categoryType)

  useEffect(() => {
    if (initial) {
      form.reset({
        type: initial.type,
        title: initial.title,
        amount: initial.amount,
        due_date: initial.due_date,
        status: initial.status,
        category_id: initial.category_id,
        notes: initial.notes,
        recurring: initial.recurring,
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
            <h2 className="text-lg font-semibold">{initial ? "Editar conta" : "Nova conta"}</h2>
            <p className="text-sm text-muted-foreground">Cadastre o que precisa pagar ou receber.</p>
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
            render={({ field }) => (
              <Field>
                <FieldLabel>Tipo</FieldLabel>
                <Select
                  items={[
                    { label: "Conta a pagar", value: "payable" },
                    { label: "Conta a receber", value: "receivable" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="payable">Conta a pagar</SelectItem>
                      <SelectItem value="receivable">Conta a receber</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
          <Field data-invalid={!!form.formState.errors.title}>
            <FieldLabel htmlFor="title">Nome da conta</FieldLabel>
            <Input id="title" placeholder="Ex.: aluguel, internet, cliente" {...form.register("title")} />
            <FieldError errors={[form.formState.errors.title]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.amount}>
            <FieldLabel htmlFor="amount">Valor</FieldLabel>
            <Input id="amount" type="number" step="0.01" inputMode="decimal" {...form.register("amount")} />
            <FieldError errors={[form.formState.errors.amount]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.due_date}>
            <FieldLabel htmlFor="due_date">Vencimento</FieldLabel>
            <Input id="due_date" type="date" {...form.register("due_date")} />
            <FieldError errors={[form.formState.errors.due_date]} />
          </Field>
          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  items={[
                    { label: "Pendente", value: "pending" },
                    { label: "Paga/recebida", value: "paid" },
                    { label: "Vencida", value: "overdue" },
                    { label: "Cancelada", value: "canceled" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="pending">Pendente</SelectItem>
                      <SelectItem value="paid">Paga/recebida</SelectItem>
                      <SelectItem value="overdue">Vencida</SelectItem>
                      <SelectItem value="canceled">Cancelada</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />
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
            name="recurring"
            render={({ field }) => (
              <Field orientation="horizontal" className="rounded-xl border p-3">
                <Checkbox checked={field.value} onCheckedChange={(checked) => field.onChange(Boolean(checked))} />
                <div className="flex flex-col gap-1">
                  <FieldLabel>Repete?</FieldLabel>
                  <p className="text-sm text-muted-foreground">Use para aluguel, internet ou recebimentos fixos.</p>
                </div>
              </Field>
            )}
          />
          {recurring && (
            <Controller
              control={form.control}
              name="recurrence_type"
              render={({ field }) => (
                <Field>
                  <FieldLabel>Frequência</FieldLabel>
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
          <Textarea id="notes" placeholder="Algum detalhe importante" {...form.register("notes")} />
        </Field>

        <Button type="submit" className="min-h-12 w-full text-base sm:w-fit">
          {initial ? <Save data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
          {initial ? "Salvar conta" : "Criar conta"}
        </Button>
      </FieldGroup>
    </form>
  )
}
