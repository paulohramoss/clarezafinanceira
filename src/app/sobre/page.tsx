import Link from "next/link"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export default function AboutPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-16">
      <Link href="/" className="text-sm font-medium text-muted-foreground">
        Clareza Financeira
      </Link>
      <h1 className="text-4xl font-semibold tracking-normal">Sobre</h1>
      <p className="text-lg leading-8 text-muted-foreground">
        O Clareza Financeira ajuda pessoas comuns a organizar dinheiro de forma simples. Ele mostra entradas, saídas, contas, dívidas, metas e alertas úteis para você entender sua situação sem jargões.
      </p>
      <p className="text-lg leading-8 text-muted-foreground">
        O sistema não substitui profissional financeiro, contador, banco ou consultor. Ele também não faz recomendação personalizada de investimento nem promete enriquecimento.
      </p>
      <Link href="/cadastro" className={cn(buttonVariants(), "min-h-12 w-fit rounded-xl px-5 text-base")}>
        Começar agora
      </Link>
    </main>
  )
}
