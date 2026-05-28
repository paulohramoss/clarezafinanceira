import { AlertTriangle } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import type { FinancialAlert } from "@/types/finance"

export function MainAlertCard({ alert }: { alert: FinancialAlert }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle aria-hidden="true" />
            Alerta principal
          </CardTitle>
          <StatusBadge status={alert.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        <p className="text-lg font-semibold">{alert.title}</p>
        <p className="text-sm leading-6 text-muted-foreground">{alert.message}</p>
      </CardContent>
    </Card>
  )
}
