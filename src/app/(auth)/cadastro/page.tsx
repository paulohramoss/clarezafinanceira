import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"

export default function SignupPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[color:var(--cf-page-soft)] px-4 py-10">
      <div className="flex w-full max-w-5xl flex-col gap-8 md:grid md:grid-cols-[0.9fr_1fr] md:items-center">
        <section className="flex flex-col gap-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground">
            Clareza Financeira
          </Link>
          <h1 className="text-4xl font-semibold tracking-normal">Comece organizando o básico.</h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Sem termos complicados. Você cadastra entradas, saídas e contas. O sistema mostra o que importa.
          </p>
        </section>
        <AuthCard mode="signup" />
      </div>
    </main>
  )
}
