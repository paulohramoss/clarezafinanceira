import Link from "next/link"

export default function TermsPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-16">
      <Link href="/" className="text-sm font-medium text-muted-foreground">
        Clareza Financeira
      </Link>
      <h1 className="text-4xl font-semibold tracking-normal">Termos</h1>
      <p className="text-lg leading-8 text-muted-foreground">
        O Clareza Financeira é uma ferramenta de organização, orçamento e educação financeira simples. Ele não substitui banco, contador, consultor financeiro ou profissional habilitado.
      </p>
      <p className="text-lg leading-8 text-muted-foreground">
        As informações e alertas são estimativas baseadas nos dados cadastrados pelo usuário. Não há promessa de ganho, enriquecimento ou resultado financeiro.
      </p>
    </main>
  )
}
