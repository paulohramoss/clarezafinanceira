import { cn } from "@/lib/utils"
import { formatCurrency } from "@/lib/finance/format-money"

type MoneyDisplayProps = {
  value: number
  currency?: string
  tone?: "default" | "positive" | "negative" | "muted"
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
}

export function MoneyDisplay({
  value,
  currency = "BRL",
  tone = "default",
  size = "md",
  className,
}: MoneyDisplayProps) {
  return (
    <span
      title={formatCurrency(value, currency)}
      className={cn(
        "inline-block max-w-full min-w-0 align-baseline [container-type:inline-size]",
        tone === "positive" && "text-[color:var(--cf-success)]",
        tone === "negative" && "text-[color:var(--cf-danger)]",
        tone === "muted" && "text-muted-foreground",
        className,
      )}
    >
      <span
        className={cn(
          "block max-w-full whitespace-nowrap font-semibold leading-tight tabular-nums tracking-normal text-current",
          "[font-size:clamp(var(--money-min),var(--money-fluid),var(--money-max))]",
          size === "sm" && "[--money-fluid:14cqw] [--money-max:1rem] [--money-min:0.8125rem]",
          size === "md" && "[--money-fluid:13cqw] [--money-max:1.25rem] [--money-min:0.875rem]",
          size === "lg" && "[--money-fluid:13cqw] [--money-max:1.5rem] [--money-min:0.875rem]",
          size === "xl" && "[--money-fluid:11cqw] [--money-max:2.25rem] [--money-min:0.9375rem]",
        )}
      >
        {formatCurrency(value, currency)}
      </span>
    </span>
  )
}
