import { cn } from "@/lib/utils"

type PageTitleProps = {
  title: string
  description?: string
  action?: React.ReactNode
  className?: string
}

export function PageTitle({ title, description, action, className }: PageTitleProps) {
  return (
    <div className={cn("flex flex-col gap-4 md:flex-row md:items-start md:justify-between", className)}>
      <div className="flex max-w-3xl flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-normal md:text-3xl">{title}</h1>
        {description && <p className="text-base leading-7 text-muted-foreground">{description}</p>}
      </div>
      {action}
    </div>
  )
}
