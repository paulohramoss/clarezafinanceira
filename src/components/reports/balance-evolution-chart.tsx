"use client"

import { CartesianGrid, Line, LineChart, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/finance/format-money"
import type { MonthlyPoint } from "@/types/finance"

export function BalanceEvolutionChart({ data, currency }: { data: MonthlyPoint[]; currency: string }) {
  const last = data[data.length - 1]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Evolução do saldo</CardTitle>
        <CardDescription>
          {last
            ? `Seu saldo estimado terminou em ${formatCurrency(last.balance, currency)} no último ponto do gráfico.`
            : "Cadastre transações para ver a evolução."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ balance: { label: "Saldo", color: "var(--chart-1)" } }}
          className="min-h-72 w-full"
        >
          <LineChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => formatCurrency(Number(value), currency)} width={84} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value), currency)} />} />
            <Line type="monotone" dataKey="balance" stroke="var(--chart-1)" strokeWidth={3} dot />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
