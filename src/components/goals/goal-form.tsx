"use client"

import { useEffect } from "react"
import { useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Plus, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Field, FieldError, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { goalSchema, type GoalFormValues } from "@/lib/validation/finance-schemas"
import type { Goal } from "@/types/finance"

type GoalFormProps = {
  initial?: Goal | null
  onSubmit: (values: GoalFormValues) => Promise<void> | void
  onCancelEdit?: () => void
}

const baseValues: GoalFormValues = {
  title: "",
  target_amount: 0,
  current_amount: 0,
  target_date: null,
  category: null,
}

export function GoalForm({ initial, onSubmit, onCancelEdit }: GoalFormProps) {
  const form = useForm<GoalFormValues>({
    resolver: zodResolver(goalSchema) as Resolver<GoalFormValues>,
    defaultValues: baseValues,
  })

  useEffect(() => {
    if (initial) {
      form.reset({
        title: initial.title,
        target_amount: initial.target_amount,
        current_amount: initial.current_amount,
        target_date: initial.target_date,
        category: initial.category,
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
            <h2 className="text-lg font-semibold">{initial ? "Editar meta" : "Nova meta"}</h2>
            <p className="text-sm text-muted-foreground">Metas pequenas e visíveis ajudam a manter constância.</p>
          </div>
          {initial && (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancelar edição
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.title}>
            <FieldLabel htmlFor="title">Nome da meta</FieldLabel>
            <Input id="title" placeholder="Reserva, viagem, estudos..." {...form.register("title")} />
            <FieldError errors={[form.formState.errors.title]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="category">Categoria</FieldLabel>
            <Input id="category" placeholder="reserva, viagem, dívida..." {...form.register("category")} />
          </Field>
          <Field data-invalid={!!form.formState.errors.target_amount}>
            <FieldLabel htmlFor="target_amount">Valor alvo</FieldLabel>
            <Input id="target_amount" type="number" step="0.01" {...form.register("target_amount")} />
            <FieldError errors={[form.formState.errors.target_amount]} />
          </Field>
          <Field data-invalid={!!form.formState.errors.current_amount}>
            <FieldLabel htmlFor="current_amount">Valor guardado</FieldLabel>
            <Input id="current_amount" type="number" step="0.01" {...form.register("current_amount")} />
            <FieldError errors={[form.formState.errors.current_amount]} />
          </Field>
          <Field>
            <FieldLabel htmlFor="target_date">Data desejada</FieldLabel>
            <Input id="target_date" type="date" {...form.register("target_date")} />
          </Field>
        </div>

        <Button type="submit" className="min-h-12 w-full text-base sm:w-fit">
          {initial ? <Save data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
          {initial ? "Salvar meta" : "Criar meta"}
        </Button>
      </FieldGroup>
    </form>
  )
}
