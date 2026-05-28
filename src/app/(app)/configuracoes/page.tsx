"use client"

import { Controller, useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Download, Eraser, FileText, ShieldAlert, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { PageTitle } from "@/components/layout/page-title"
import { useFinance } from "@/components/providers/finance-provider"
import { formatCurrency } from "@/lib/finance/format-money"
import { simpleFinancialSummaryText, transactionsToCsv } from "@/lib/finance/export"
import { profileSchema, type ProfileFormValues } from "@/lib/validation/finance-schemas"

function download(filename: string, content: string | Blob, type = "text/csv;charset=utf-8") {
  const blob = content instanceof Blob ? content : new Blob([content], { type })
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement("a")
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

export default function SettingsPage() {
  const {
    data,
    summary,
    updateProfile,
    resetDemo,
    clearLocalData,
    clearFinancialData,
    anonymizeFinancialData,
    deleteAccount,
  } = useFinance()
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema) as Resolver<ProfileFormValues>,
    values: {
      full_name: data.profile.full_name,
      visual_mode: data.profile.visual_mode,
      font_scale: data.profile.font_scale,
      help_style: data.profile.help_style,
      main_goal: data.profile.main_goal,
      approximate_income: data.profile.approximate_income,
      currency: data.profile.currency,
    },
  })

  const exportTransactionsCsv = () => {
    download("clareza-financeira-transacoes.csv", transactionsToCsv(data))
    toast.success("Transações exportadas em CSV")
  }

  const exportSimpleSummary = () => {
    download(
      "clareza-financeira-resumo.txt",
      simpleFinancialSummaryText(data, summary),
      "text/plain;charset=utf-8",
    )
    toast.success("Resumo simples exportado")
  }

  const exportMonthlyPdf = async () => {
    const { jsPDF } = await import("jspdf")
    const report = summary.monthlyReport
    const doc = new jsPDF()
    const lines = [
      `Relatório mensal - ${report.monthLabel}`,
      "",
      `Entrou: ${formatCurrency(report.income, data.profile.currency)}`,
      `Saiu: ${formatCurrency(report.expense, data.profile.currency)}`,
      `Resultado: ${formatCurrency(report.result, data.profile.currency)}`,
      "",
      "Maiores gastos:",
      ...report.largestExpenses.slice(0, 5).map((item) => `- ${item.description}: ${formatCurrency(item.amount, data.profile.currency)}`),
      "",
      "Insights:",
      ...report.insights.map((item) => `- ${item.title}: ${item.description}`),
      "",
      "Recomendações gerais:",
      ...report.recommendations.map((item) => `- ${item}`),
    ]
    doc.setFont("helvetica", "bold")
    doc.setFontSize(16)
    doc.text("Clareza Financeira", 14, 18)
    doc.setFont("helvetica", "normal")
    doc.setFontSize(11)
    doc.text(lines, 14, 30, { maxWidth: 180 })
    doc.save("clareza-financeira-relatorio-mensal.pdf")
    toast.success("PDF gerado")
  }

  const removeAccount = async () => {
    try {
      await deleteAccount()
      toast.success("Conta e dados removidos quando havia sessão ativa")
    } catch (error) {
      clearLocalData()
      toast.error(
        error instanceof Error
          ? error.message
          : "Não consegui excluir a conta no Firebase. Limpei os dados locais.",
      )
    }
  }

  return (
    <>
      <PageTitle
        title="Configurações"
        description="Ajuste nome, renda aproximada, moeda, modo visual, estilo de ajuda e privacidade dos dados."
      />

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Preferências</CardTitle>
          <CardDescription>Use linguagem e visual do jeito que fica mais fácil para você.</CardDescription>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-5"
            onSubmit={form.handleSubmit(async (values) => {
              await updateProfile({ ...data.profile, ...values })
              toast.success("Configurações salvas")
            })}
          >
            <FieldGroup>
              <div className="grid gap-4 md:grid-cols-2">
                <Field>
                  <FieldLabel htmlFor="full_name">Nome</FieldLabel>
                  <Input id="full_name" {...form.register("full_name")} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="currency">Moeda</FieldLabel>
                  <Input id="currency" maxLength={3} {...form.register("currency")} />
                </Field>
                <Field data-invalid={!!form.formState.errors.approximate_income}>
                  <FieldLabel htmlFor="approximate_income">Renda aproximada</FieldLabel>
                  <Input id="approximate_income" type="number" step="0.01" {...form.register("approximate_income")} />
                  <FieldError errors={[form.formState.errors.approximate_income]} />
                </Field>
                <Field>
                  <FieldLabel htmlFor="main_goal">Objetivo principal</FieldLabel>
                  <Input id="main_goal" {...form.register("main_goal")} />
                </Field>
                <Controller
                  control={form.control}
                  name="visual_mode"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Modo visual</FieldLabel>
                      <Select
                        items={[
                          { label: "Simples", value: "simple" },
                          { label: "Detalhado", value: "detailed" },
                        ]}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="min-h-11 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="simple">Simples</SelectItem>
                            <SelectItem value="detailed">Detalhado</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="font_scale"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Tamanho da fonte</FieldLabel>
                      <Select
                        items={[
                          { label: "Normal", value: "normal" },
                          { label: "Grande", value: "large" },
                          { label: "Extra grande", value: "extra-large" },
                        ]}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="min-h-11 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="normal">Normal</SelectItem>
                            <SelectItem value="large">Grande</SelectItem>
                            <SelectItem value="extra-large">Extra grande</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
                <Controller
                  control={form.control}
                  name="help_style"
                  render={({ field }) => (
                    <Field>
                      <FieldLabel>Estilo de ajuda</FieldLabel>
                      <Select
                        items={[
                          { label: "Direto ao ponto", value: "direct" },
                          { label: "Explicativo", value: "explanatory" },
                          { label: "Bem simples", value: "beginner" },
                        ]}
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger className="min-h-11 w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="direct">Direto ao ponto</SelectItem>
                            <SelectItem value="explanatory">Explicativo</SelectItem>
                            <SelectItem value="beginner">Bem simples</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </Field>
                  )}
                />
              </div>
              <Button type="submit" className="min-h-12 w-full text-base sm:w-fit">
                Salvar configurações
              </Button>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle>Dados e privacidade</CardTitle>
          <CardDescription>Exporte, anonimize ou apague seus dados financeiros quando precisar.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Alert className="border-[color:var(--cf-warning-border)] bg-[color:var(--cf-warning-soft)]">
            <ShieldAlert aria-hidden="true" />
            <AlertTitle>Não cadastre dados sensíveis de acesso</AlertTitle>
            <AlertDescription>
              Não informe senha de banco, código de segurança, token, número completo de cartão ou qualquer dado que permita acessar sua conta.
            </AlertDescription>
          </Alert>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button type="button" variant="outline" className="min-h-12" onClick={exportTransactionsCsv}>
              <Download data-icon="inline-start" />
              Transações CSV
            </Button>
            <Button type="button" variant="outline" className="min-h-12" onClick={exportMonthlyPdf}>
              <FileText data-icon="inline-start" />
              Relatório PDF
            </Button>
            <Button type="button" variant="outline" className="min-h-12" onClick={exportSimpleSummary}>
              <Download data-icon="inline-start" />
              Resumo simples
            </Button>
            <Button type="button" variant="outline" className="min-h-12" onClick={resetDemo}>
              Ver exemplo com dados fictícios
            </Button>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              type="button"
              variant="outline"
              className="min-h-12"
              onClick={async () => {
                await anonymizeFinancialData()
                toast.success("Dados anonimizados")
              }}
            >
              <Eraser data-icon="inline-start" />
              Anonimizar dados
            </Button>
            <Button
              type="button"
              variant="destructive"
              className="min-h-12"
              onClick={async () => {
                await clearFinancialData()
                toast.success("Dados financeiros apagados")
              }}
            >
              <Trash2 data-icon="inline-start" />
              Apagar dados financeiros
            </Button>
            <Button type="button" variant="destructive" className="min-h-12" onClick={removeAccount}>
              <Trash2 data-icon="inline-start" />
              Excluir conta/dados
            </Button>
          </div>
        </CardContent>
      </Card>
    </>
  )
}
