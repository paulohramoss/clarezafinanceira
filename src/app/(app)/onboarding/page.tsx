"use client"

import { useRouter } from "next/navigation"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Field, FieldGroup, FieldLabel, FieldLegend, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useFinance } from "@/components/providers/finance-provider"
import type { HelpStyle, VisualMode } from "@/types/finance"

type OnboardingValues = {
  main_goal: string
  approximate_income: number | null
  visual_mode: VisualMode
  help_style: HelpStyle
}

export default function OnboardingPage() {
  const router = useRouter()
  const { data, updateProfile } = useFinance()
  const form = useForm<OnboardingValues>({
    defaultValues: {
      main_goal: data.profile.main_goal ?? "Controlar gastos",
      approximate_income: data.profile.approximate_income,
      visual_mode: data.profile.visual_mode,
      help_style: data.profile.help_style,
    },
  })

  return (
    <div className="mx-auto w-full max-w-3xl">
      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Vamos deixar sua tela mais útil</CardTitle>
          <CardDescription>Responda poucas perguntas. Você pode mudar isso depois.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-6"
            onSubmit={form.handleSubmit(async (values) => {
              await updateProfile({
                ...data.profile,
                main_goal: values.main_goal,
                approximate_income: values.approximate_income,
                visual_mode: values.visual_mode,
                font_scale: data.profile.font_scale,
                help_style: values.help_style,
              })
              toast.success("Preferências salvas")
              router.push("/dashboard")
            })}
          >
            <FieldGroup>
              <FieldSet>
                <FieldLegend>Qual é seu objetivo principal?</FieldLegend>
                <Controller
                  control={form.control}
                  name="main_goal"
                  render={({ field }) => (
                    <Select
                      items={[
                        { label: "Controlar gastos", value: "Controlar gastos" },
                        { label: "Sair das dívidas", value: "Sair das dívidas" },
                        { label: "Guardar dinheiro", value: "Guardar dinheiro" },
                        { label: "Organizar contas da casa", value: "Organizar contas da casa" },
                        { label: "Controlar renda variável/autônomo", value: "Controlar renda variável/autônomo" },
                        { label: "Entender para onde o dinheiro vai", value: "Entender para onde o dinheiro vai" },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="min-h-12 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {[
                            "Controlar gastos",
                            "Sair das dívidas",
                            "Guardar dinheiro",
                            "Organizar contas da casa",
                            "Controlar renda variável/autônomo",
                            "Entender para onde o dinheiro vai",
                          ].map((item) => (
                            <SelectItem key={item} value={item}>
                              {item}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </FieldSet>

              <Field>
                <FieldLabel htmlFor="approximate_income">Qual sua renda mensal aproximada?</FieldLabel>
                <Input
                  id="approximate_income"
                  type="number"
                  step="0.01"
                  placeholder="Opcional"
                  {...form.register("approximate_income", { valueAsNumber: true })}
                />
              </Field>

              <Field>
                <FieldLabel>Você prefere visualizar os valores de forma</FieldLabel>
                <Controller
                  control={form.control}
                  name="visual_mode"
                  render={({ field }) => (
                    <Select
                      items={[
                        { label: "Simples", value: "simple" },
                        { label: "Detalhada", value: "detailed" },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="min-h-12 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="simple">Simples</SelectItem>
                          <SelectItem value="detailed">Detalhada</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>

              <Field>
                <FieldLabel>Qual estilo de ajuda você quer?</FieldLabel>
                <Controller
                  control={form.control}
                  name="help_style"
                  render={({ field }) => (
                    <Select
                      items={[
                        { label: "Direto ao ponto", value: "direct" },
                        { label: "Explicativo", value: "explanatory" },
                        { label: "Bem simples, como iniciante", value: "beginner" },
                      ]}
                      value={field.value}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="min-h-12 w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          <SelectItem value="direct">Direto ao ponto</SelectItem>
                          <SelectItem value="explanatory">Explicativo</SelectItem>
                          <SelectItem value="beginner">Bem simples, como iniciante</SelectItem>
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
              </Field>
            </FieldGroup>

            <Button type="submit" className="min-h-12 text-base">
              <ArrowRight data-icon="inline-start" />
              Ir para dashboard
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
