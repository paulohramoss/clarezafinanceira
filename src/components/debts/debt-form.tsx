"use client"

import { useEffect } from "react"
import { Controller, useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
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
import { debtSchema, type DebtFormValues } from "@/lib/validation/finance-schemas"
import type { Debt } from "@/types/finance"

type DebtFormProps = {
  initial?: Debt | null
  onSubmit: (values: DebtFormValues) => Promise<void> | void
  onCancelEdit?: () => void
}

const baseValues: DebtFormValues = {
  creditor_name: "",
  original_amount: 0,
  current_balance: 0,
  monthly_payment: null,
  due_day: null,
  interest_rate: null,
  status: "active",
  notes: null,
}

export function DebtForm({ initial, onSubmit, onCancelEdit }: DebtFormProps) {
  const form = useForm<DebtFormValues>({
    resolver: zodResolver(debtSchema) as Resolver<DebtFormValues>,
    defaultValues: baseValues,
  })

  useEffect(() => {
    if (initial) {
      form.reset({
        creditor_name: initial.creditor_name,
        original_amount: initial.original_amount,
        current_balance: initial.current_balance,
        monthly_payment: initial.monthly_payment,
        due_day: initial.due_day,
        interest_rate: initial.interest_rate,
        status: initial.status,
        notes: initial.notes,
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
            <h2 className="text-lg font-semibold">{initial ? "Editar dívida" : "Nova dívida"}</h2>
            <p className="text-sm text-muted-foreground">Coloque tudo no papel para enxergar com clareza.</p>
          </div>
          {initial && (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancelar edição
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.creditor_name}>
            <FieldLabel htmlFor="creditor_name">Nome do credor</FieldLabel>
            <Input id="creditor_name" placeholder="Banco, cartão, pessoa..." {...form.register("creditor_name")} />
            <FieldError errors={[form.formState.errors.creditor_name]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.status}>
            <FieldLabel>Status</FieldLabel>
            <Controller
              control={form.control}
              name="status"
              render={({ field }) => (
                <Select
                  items={[
                    { label: "Ativa", value: "active" },
                    { label: "Paga", value: "paid" },
                    { label: "Renegociando", value: "renegotiating" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="active">Ativa</SelectItem>
                      <SelectItem value="paid">Paga</SelectItem>
                      <SelectItem value="renegotiating">Renegociando</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              )}
            />
          </Field>
          <Field data-invalid={!!form.formState.errors.original_amount}>
            <FieldLabel htmlFor="original_amount">Valor original</FieldLabel>
            <Input id="original_amount" type="number" step="0.01" {...form.register("original_amount")} />
            <FieldError errors={[form.formState.errors.original_amount]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.current_balance}>
            <FieldLabel htmlFor="current_balance">Saldo atual</FieldLabel>
            <Input id="current_balance" type="number" step="0.01" {...form.register("current_balance")} />
            <FieldError errors={[form.formState.errors.current_balance]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="monthly_payment">Parcela mensal</FieldLabel>
            <Input id="monthly_payment" type="number" step="0.01" {...form.register("monthly_payment")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="due_day">Dia de vencimento</FieldLabel>
            <Input id="due_day" type="number" min="1" max="31" {...form.register("due_day")} />
          </Field>
          <Field>
            <FieldLabel htmlFor="interest_rate">Juros ao mês, se souber</FieldLabel>
            <Input id="interest_rate" type="number" step="0.01" {...form.register("interest_rate")} />
          </Field>
        </div>

        <Field>
          <FieldLabel htmlFor="notes">Observações</FieldLabel>
          <Textarea id="notes" placeholder="Ex.: tentar renegociação, boleto, contato..." {...form.register("notes")} />
        </Field>

        <Button type="submit" className="min-h-12 w-full text-base sm:w-fit">
          {initial ? <Save data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
          {initial ? "Salvar dívida" : "Criar dívida"}
        </Button>
      </FieldGroup>
    </form>
  )
}
