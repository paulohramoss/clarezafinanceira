"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/finance/format-money"
import type { CategorySpending } from "@/types/finance"

export function SpendingByCategoryChart({
  data,
  currency,
}: {
  data: CategorySpending[]
  currency: string
}) {
  const chartData = data.slice(0, 6).map((item) => ({
    categoria: item.categoryName,
    valor: item.amount,
  }))
  const top = data[0]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Gastos por categoria</CardTitle>
        <CardDescription>
          {top
            ? `Sua maior despesa este mês foi ${top.categoryName}, com ${formatCurrency(top.amount, currency)}. Isso representa ${Math.round(top.percentage)}% dos seus gastos.`
            : "Cadastre gastos para visualizar suas principais categorias."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{ valor: { label: "Valor", color: "var(--chart-1)" } }}
          className="min-h-72 w-full"
        >
          <BarChart data={chartData} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="categoria" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => formatCurrency(Number(value), currency)} width={84} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value), currency)} />} />
            <Bar dataKey="valor" fill="var(--chart-1)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
