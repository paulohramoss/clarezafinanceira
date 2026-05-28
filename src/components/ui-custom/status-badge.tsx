import { AlertCircle, CheckCircle2, CircleAlert, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { AlertStatus } from "@/types/finance"

const config = {
  ok: { label: "Tudo certo", icon: CheckCircle2, className: "border-[color:var(--cf-success-border)] bg-[color:var(--cf-success-soft)] text-[color:var(--cf-success)]" },
  attention: { label: "Atenção", icon: Info, className: "border-[color:var(--cf-warning-border)] bg-[color:var(--cf-warning-soft)] text-[color:var(--cf-warning)]" },
  risk: { label: "Risco", icon: CircleAlert, className: "border-[color:var(--cf-orange-border)] bg-[color:var(--cf-orange-soft)] text-[color:var(--cf-orange)]" },
  danger: { label: "Urgente", icon: AlertCircle, className: "border-[color:var(--cf-danger-border)] bg-[color:var(--cf-danger-soft)] text-[color:var(--cf-danger)]" },
}

export function StatusBadge({ status, label }: { status: AlertStatus; label?: string }) {
  const item = config[status]
  const Icon = item.icon

  return (
    <Badge variant="outline" className={item.className}>
      <Icon data-icon="inline-start" />
      {label ?? item.label}
    </Badge>
  )
}
