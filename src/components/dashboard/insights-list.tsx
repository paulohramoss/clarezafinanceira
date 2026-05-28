import { Lightbulb } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import type { FinancialInsight } from "@/types/finance"

export function InsightsList({ insights }: { insights: FinancialInsight[] }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <Lightbulb aria-hidden="true" />
          Insights para você
        </CardTitle>
        <CardDescription>Observações simples para agir com calma.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid gap-3 md:grid-cols-2">
          {insights.map((insight) => (
            <article key={insight.id} className="flex flex-col gap-3 rounded-xl border bg-background p-4">
              <div className="flex items-start justify-between gap-3">
                <h3 className="font-medium">{insight.title}</h3>
                <StatusBadge status={insight.status} />
              </div>
              <p className="text-sm leading-6 text-muted-foreground">{insight.description}</p>
              {insight.action && <p className="text-sm font-medium">{insight.action}</p>}
            </article>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
