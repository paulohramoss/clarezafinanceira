"use client"

import Link from "next/link"
import { ArrowRight, CalendarClock, Repeat2 } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTitle } from "@/components/layout/page-title"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import { EmptyState } from "@/components/ui-custom/empty-state"
import { useFinance } from "@/components/providers/finance-provider"
import { cn } from "@/lib/utils"

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR", { day: "2-digit", month: "short", year: "numeric" }).format(
    new Date(`${date}T12:00:00`),
  )
}

function sourceLabel(source: string) {
  return {
    recurring: "Marcada como recorrente",
    keyword: "Detectada pelo nome",
    repeated: "Repetida no extrato",
  }[source] ?? "Detectada"
}

export default function SubscriptionsPage() {
  const { data, summary } = useFinance()
  const currency = data.profile.currency
  const subscriptions = summary.subscriptionSummary

  return (
    <>
      <PageTitle
        title="Assinaturas"
        description="Veja gastos que costumam voltar todo mês, como streaming, celular, internet e academia."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Repeat2 aria-hidden="true" />
              Total mensal
            </CardTitle>
            <CardDescription>Uma estimativa do que volta todo mês.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            <MoneyDisplay value={subscriptions.totalMonthly} currency={currency} size="xl" tone="negative" />
            <p className="leading-7 text-muted-foreground">{subscriptions.alertText}</p>
            <StatusBadge status={subscriptions.totalMonthly > 250 ? "attention" : "ok"} />
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle>Assinaturas encontradas</CardTitle>
            <CardDescription>Confira se ainda usa tudo que aparece aqui.</CardDescription>
          </CardHeader>
          <CardContent>
            {subscriptions.items.length === 0 ? (
              <EmptyState
                title="Nenhuma assinatura detectada"
                description="Quando houver transações recorrentes ou nomes como Netflix, Spotify, iCloud, Google, internet ou celular, elas aparecem aqui."
              />
            ) : (
              <div className="grid gap-3 md:grid-cols-2">
                {subscriptions.items.map((item) => (
                  <article key={item.id} className="flex flex-col gap-3 rounded-lg border bg-background p-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h2 className="truncate font-semibold">{item.name}</h2>
                        <p className="text-sm text-muted-foreground">{sourceLabel(item.source)}</p>
                      </div>
                      {item.possiblyForgotten && <StatusBadge status="attention" label="Revisar" />}
                    </div>
                    <MoneyDisplay value={item.amount} currency={currency} size="lg" tone="negative" />
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarClock aria-hidden="true" />
                      Último lançamento: {formatDate(item.lastDate)}
                    </p>
                  </article>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {subscriptions.forgotten.length > 0 && (
        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Possivelmente esquecidas</CardTitle>
            <CardDescription>Não cancele no impulso. Confira antes se ainda faz sentido manter.</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {subscriptions.forgotten.map((item) => (
              <div key={item.id} className="rounded-lg border bg-background p-4">
                <p className="font-semibold">{item.name}</p>
                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  Foi detectada como recorrente e merece uma revisão rápida.
                </p>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <Link
        href="/transacoes"
        className={cn(buttonVariants({ variant: "outline" }), "min-h-12 w-full text-base sm:w-fit")}
      >
        Revisar transações
        <ArrowRight data-icon="inline-end" />
      </Link>
    </>
  )
}
