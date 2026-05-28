"use client"

import Link from "next/link"
import { ArrowRight, BellRing } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { PageTitle } from "@/components/layout/page-title"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import { useFinance } from "@/components/providers/finance-provider"
import { cn } from "@/lib/utils"

const typeLabel = {
  bill: "Conta",
  spending: "Gasto",
  balance: "Saldo",
  debt: "Dívida",
  goal: "Meta",
  positive: "Tudo certo",
}

export default function AlertsPage() {
  const { summary } = useFinance()
  const alerts = [...summary.alerts].sort((a, b) => a.priority - b.priority)

  return (
    <>
      <PageTitle
        title="Alertas"
        description="Avisos simples sobre contas, saldo, gastos, dívidas e metas."
      />

      <section className="grid gap-4 lg:grid-cols-3">
        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BellRing aria-hidden="true" />
              Central de alertas
            </CardTitle>
            <CardDescription>O primeiro alerta da lista é o mais importante agora.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-3">
            {alerts.map((alert) => (
              <article key={alert.id} className="flex flex-col gap-3 rounded-lg border bg-background p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase text-muted-foreground">
                      {alert.type ? typeLabel[alert.type] : "Aviso"}
                    </p>
                    <h2 className="mt-1 text-lg font-semibold">{alert.title}</h2>
                  </div>
                  <StatusBadge status={alert.status} />
                </div>
                <p className="leading-7 text-muted-foreground">{alert.message}</p>
                {alert.action && <p className="font-medium">{alert.action}</p>}
              </article>
            ))}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader>
            <CardTitle>Como usar</CardTitle>
            <CardDescription>Sem alarme desnecessário. Só o que pede sua atenção.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <p className="leading-7 text-muted-foreground">
              Os alertas não substituem banco, contador ou consultor financeiro. Eles servem para mostrar o que revisar primeiro.
            </p>
            <Link href="/dashboard" className={cn(buttonVariants(), "min-h-12 w-full text-base")}>
              Voltar ao dashboard
              <ArrowRight data-icon="inline-end" />
            </Link>
          </CardContent>
        </Card>
      </section>
    </>
  )
}
