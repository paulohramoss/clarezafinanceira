"use client"

import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { formatCurrency } from "@/lib/finance/format-money"
import type { MonthlyPoint } from "@/types/finance"

export function IncomeExpenseChart({ data, currency }: { data: MonthlyPoint[]; currency: string }) {
  const current = data[data.length - 1]

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Entradas x saídas</CardTitle>
        <CardDescription>
          {current
            ? `No mês atual entraram ${formatCurrency(current.income, currency)} e saíram ${formatCurrency(current.expense, currency)}.`
            : "Sem dados suficientes para comparar."}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            income: { label: "Entrou", color: "var(--chart-2)" },
            expense: { label: "Saiu", color: "var(--chart-4)" },
          }}
          className="min-h-72 w-full"
        >
          <BarChart data={data} accessibilityLayer>
            <CartesianGrid vertical={false} />
            <XAxis dataKey="label" tickLine={false} axisLine={false} />
            <YAxis tickFormatter={(value) => formatCurrency(Number(value), currency)} width={84} />
            <ChartTooltip content={<ChartTooltipContent formatter={(value) => formatCurrency(Number(value), currency)} />} />
            <Bar dataKey="income" fill="var(--chart-2)" radius={[8, 8, 0, 0]} />
            <Bar dataKey="expense" fill="var(--chart-4)" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
