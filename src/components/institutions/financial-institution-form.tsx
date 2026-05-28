"use client"

import { useEffect } from "react"
import { Controller, useForm, useWatch, type Resolver } from "react-hook-form"
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
import {
  financialInstitutionSchema,
  type FinancialInstitutionFormValues,
} from "@/lib/validation/finance-schemas"
import type { FinancialInstitution } from "@/types/finance"

type FinancialInstitutionFormProps = {
  initial?: FinancialInstitution | null
  onSubmit: (values: FinancialInstitutionFormValues) => Promise<void> | void
  onCancelEdit?: () => void
}

const baseValues: FinancialInstitutionFormValues = {
  name: "",
  type: "bank",
  display_name: null,
  color: "#2563eb",
  notes: null,
  status: "active",
}

export function FinancialInstitutionForm({
  initial,
  onSubmit,
  onCancelEdit,
}: FinancialInstitutionFormProps) {
  const form = useForm<FinancialInstitutionFormValues>({
    resolver: zodResolver(financialInstitutionSchema) as Resolver<FinancialInstitutionFormValues>,
    defaultValues: baseValues,
  })

  useEffect(() => {
    if (initial) {
      form.reset({
        name: initial.name,
        type: initial.type,
        display_name: initial.display_name,
        color: initial.color,
        notes: initial.notes,
        status: initial.status,
      })
      return
    }

    form.reset(baseValues)
  }, [form, initial])

  const selectedColor = useWatch({ control: form.control, name: "color" })

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
            <h2 className="text-lg font-semibold">
              {initial ? "Editar instituição" : "Nova instituição"}
            </h2>
            <p className="text-sm text-muted-foreground">
              Registre bancos, carteiras digitais e outras instituições que você usa.
            </p>
          </div>
          {initial && (
            <Button type="button" variant="outline" onClick={onCancelEdit}>
              Cancelar edição
            </Button>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Field data-invalid={!!form.formState.errors.name}>
            <FieldLabel htmlFor="institution-name">Nome da instituição</FieldLabel>
            <Input
              id="institution-name"
              placeholder="Ex.: Nubank, Banco do Brasil, Caixa"
              {...form.register("name")}
            />
            <FieldError errors={[form.formState.errors.name]} />
          </Field>

          <Field data-invalid={!!form.formState.errors.display_name}>
            <FieldLabel htmlFor="institution-display-name">Apelido</FieldLabel>
            <Input
              id="institution-display-name"
              placeholder="Ex.: conta salário, banco principal"
              {...form.register("display_name")}
            />
            <FieldError errors={[form.formState.errors.display_name]} />
          </Field>

          <Controller
            control={form.control}
            name="type"
            render={({ field }) => (
              <Field>
                <FieldLabel>Tipo</FieldLabel>
                <Select
                  items={[
                    { label: "Banco tradicional", value: "bank" },
                    { label: "Banco digital", value: "digital_bank" },
                    { label: "Carteira digital", value: "wallet" },
                    { label: "Corretora", value: "broker" },
                    { label: "Cooperativa", value: "credit_union" },
                    { label: "Outro", value: "other" },
                  ]}
                  value={field.value}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="min-h-11 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="bank">Banco tradicional</SelectItem>
                      <SelectItem value="digital_bank">Banco digital</SelectItem>
                      <SelectItem value="wallet">Carteira digital</SelectItem>
                      <SelectItem value="broker">Corretora</SelectItem>
                      <SelectItem value="credit_union">Cooperativa</SelectItem>
                      <SelectItem value="other">Outro</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Controller
            control={form.control}
            name="status"
            render={({ field }) => (
              <Field>
                <FieldLabel>Status</FieldLabel>
                <Select
                  items={[
                    { label: "Ativa", value: "active" },
                    { label: "Inativa", value: "inactive" },
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
                      <SelectItem value="inactive">Inativa</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
              </Field>
            )}
          />

          <Field data-invalid={!!form.formState.errors.color}>
            <FieldLabel htmlFor="institution-color">Cor de identificação</FieldLabel>
            <div className="flex min-w-0 items-center gap-3">
              <Input
                id="institution-color"
                type="color"
                className="h-11 w-14 shrink-0 p-1"
                {...form.register("color")}
              />
              <div className="min-w-0 flex-1 rounded-lg border px-3 py-2 text-sm text-muted-foreground">
                <span
                  className="mr-2 inline-block size-3 rounded-full align-middle"
                  style={{ backgroundColor: selectedColor }}
                  aria-hidden="true"
                />
                {selectedColor}
              </div>
            </div>
            <FieldError errors={[form.formState.errors.color]} />
          </Field>
        </div>

        <Field data-invalid={!!form.formState.errors.notes}>
          <FieldLabel htmlFor="institution-notes">Observações</FieldLabel>
          <Textarea
            id="institution-notes"
            placeholder="Ex.: onde recebe salário, banco usado para Pix, cartão principal"
            {...form.register("notes")}
          />
          <FieldError errors={[form.formState.errors.notes]} />
        </Field>

        <Button type="submit" className="min-h-12 w-full text-base sm:w-fit">
          {initial ? <Save data-icon="inline-start" /> : <Plus data-icon="inline-start" />}
          {initial ? "Salvar instituição" : "Criar instituição"}
        </Button>
      </FieldGroup>
    </form>
  )
}
