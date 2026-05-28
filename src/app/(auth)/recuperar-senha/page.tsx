import Link from "next/link"
import { AuthCard } from "@/components/auth/auth-card"

export default function RecoverPasswordPage() {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-[color:var(--cf-page-soft)] px-4 py-10">
      <div className="flex w-full max-w-5xl flex-col gap-8 md:grid md:grid-cols-[0.9fr_1fr] md:items-center">
        <section className="flex flex-col gap-4">
          <Link href="/" className="text-sm font-medium text-muted-foreground">
            Clareza Financeira
          </Link>
          <h1 className="text-4xl font-semibold tracking-normal">Recupere seu acesso.</h1>
          <p className="text-lg leading-8 text-muted-foreground">
            Informe seu e-mail para receber o link de recuperação pelo Firebase Auth.
          </p>
        </section>
        <AuthCard mode="recover" />
      </div>
    </main>
  )
}
