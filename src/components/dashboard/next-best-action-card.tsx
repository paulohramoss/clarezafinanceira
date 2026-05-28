import Link from "next/link"
import { ArrowRight, ListChecks } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import { cn } from "@/lib/utils"
import type { NextBestAction } from "@/types/finance"

export function NextBestActionCard({ action }: { action: NextBestAction }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-col gap-1">
            <CardTitle className="flex items-center gap-2 text-lg">
              <ListChecks aria-hidden="true" />
              Faça isso agora
            </CardTitle>
            <CardDescription>Uma ação simples para destravar o próximo passo.</CardDescription>
          </div>
          <StatusBadge status={action.status} />
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="rounded-lg bg-[color:var(--cf-info-soft)] p-4">
          <p className="text-lg font-semibold text-[color:var(--cf-info)]">{action.title}</p>
          <p className="mt-2 text-sm leading-6 text-foreground">{action.description}</p>
        </div>
        {action.href && action.cta && (
          <Link
            href={action.href}
            className={cn(buttonVariants(), "min-h-12 w-full text-base sm:w-fit")}
          >
            {action.cta}
            <ArrowRight data-icon="inline-end" />
          </Link>
        )}
      </CardContent>
    </Card>
  )
}
