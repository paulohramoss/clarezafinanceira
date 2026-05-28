import Link from "next/link"
import {
  AlertTriangle,
  ArrowRight,
  BanknoteArrowDown,
  BanknoteArrowUp,
  CalendarClock,
  CheckCircle2,
  Gauge,
  HeartHandshake,
  ShieldCheck,
  WalletCards,
} from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const quickView = [
  { label: "Saldo atual", icon: WalletCards },
  { label: "Gastos do mês", icon: BanknoteArrowDown },
  { label: "Entradas do mês", icon: BanknoteArrowUp },
  { label: "Contas próximas", icon: CalendarClock },
  { label: "Dívidas", icon: AlertTriangle },
  { label: "Limite seguro para gastar", icon: Gauge },
  { label: "Alertas importantes", icon: ShieldCheck },
]

const audiences = ["Jovens", "Famílias", "Autônomos", "Aposentados", "Pessoas que querem sair da bagunça financeira"]

export default function HomePage() {
  return (
    <main className="min-h-dvh bg-background text-foreground">
      <header className="fixed inset-x-0 top-0 z-40 border-b bg-background/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-3 font-semibold">
            <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <HeartHandshake aria-hidden="true" />
            </span>
            Clareza Financeira
          </Link>
          <nav className="hidden items-center gap-6 text-sm font-medium text-muted-foreground md:flex" aria-label="Principal">
            <a href="#como-funciona">Como funciona</a>
            <a href="#sem-finances">Sem financês</a>
            <Link href="/login">Entrar</Link>
          </nav>
          <Link href="/cadastro" className={cn(buttonVariants(), "min-h-10")}>
            Começar agora
          </Link>
        </div>
      </header>

      <section
        className="relative flex min-h-[92dvh] items-center overflow-hidden pt-24"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(255,255,255,0.96) 0%, rgba(255,255,255,0.88) 45%, rgba(255,255,255,0.58) 100%), url('https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1800&q=80')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 py-14 sm:px-6 lg:grid-cols-[0.85fr_1fr] lg:px-8">
          <div className="flex max-w-2xl flex-col gap-7">
            <h1 className="text-5xl font-semibold leading-tight tracking-normal md:text-6xl">
              Entenda seu dinheiro sem complicação.
            </h1>
            <p className="text-xl leading-9 text-muted-foreground">
              Veja sua situação financeira logo de cara, receba alertas úteis e saiba exatamente o que fazer para não se apertar.
            </p>
            <div className="flex flex-col gap-3 sm:flex-row">
              <Link href="/cadastro" className={cn(buttonVariants(), "min-h-12 rounded-xl px-5 text-base")}>
                Começar agora
                <ArrowRight data-icon="inline-end" />
              </Link>
              <a href="#como-funciona" className={cn(buttonVariants({ variant: "outline" }), "min-h-12 rounded-xl px-5 text-base")}>
                Ver como funciona
              </a>
            </div>
            <Link href="/dashboard" className="w-fit text-sm font-semibold text-primary underline underline-offset-4">
              Ver exemplo com dados fictícios
            </Link>
          </div>

          <div className="grid content-end gap-3 rounded-2xl border bg-background/88 p-4 shadow-2xl backdrop-blur md:grid-cols-2">
            <div className="rounded-xl bg-primary p-5 text-primary-foreground md:col-span-2">
              <p className="text-sm opacity-85">Sua situação agora</p>
              <p className="mt-2 text-4xl font-semibold">R$ 1.830</p>
              <p className="mt-2 text-sm opacity-90">Você está no controle, mas há contas chegando.</p>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">Pode gastar</p>
              <p className="mt-2 text-2xl font-semibold">R$ 43/dia</p>
            </div>
            <div className="rounded-xl border bg-background p-4">
              <p className="text-sm text-muted-foreground">Próxima conta</p>
              <p className="mt-2 text-2xl font-semibold">Aluguel</p>
              <p className="text-sm text-muted-foreground">vence em 2 dias</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <h2 className="text-3xl font-semibold tracking-normal">O que você vê logo de cara</h2>
          <p className="mt-3 text-lg leading-8 text-muted-foreground">
            A tela inicial mostra o que importa para decidir o próximo passo, sem lotar sua cabeça.
          </p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {quickView.map((item) => {
            const Icon = item.icon
            return (
              <article key={item.label} className="flex min-h-28 items-center gap-4 rounded-xl border bg-card p-4 shadow-sm">
                <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                  <Icon aria-hidden="true" />
                </span>
                <h3 className="font-semibold">{item.label}</h3>
              </article>
            )
          })}
        </div>
      </section>

      <section className="bg-[color:var(--cf-page-soft)]">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="flex flex-col gap-4">
            <h2 className="text-3xl font-semibold tracking-normal">Para quem é</h2>
            <p className="text-lg leading-8 text-muted-foreground">
              Para pessoas reais, com rotina real, que precisam enxergar o dinheiro de forma simples.
            </p>
          </div>
          <div className="grid gap-3">
            {audiences.map((item) => (
              <div key={item} className="flex items-center gap-3 rounded-xl bg-background p-4">
                <CheckCircle2 className="text-[color:var(--cf-success)]" aria-hidden="true" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="como-funciona" className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-16 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-semibold tracking-normal">Como funciona</h2>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            "Cadastre suas entradas e gastos",
            "O sistema organiza tudo automaticamente",
            "Você recebe alertas e orientações claras",
          ].map((item, index) => (
            <article key={item} className="rounded-xl border bg-card p-5 shadow-sm">
              <span className="flex size-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                {index + 1}
              </span>
              <h3 className="mt-5 text-xl font-semibold">{item}</h3>
            </article>
          ))}
        </div>
      </section>

      <section id="sem-finances" className="bg-primary text-primary-foreground">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-16 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-semibold tracking-normal">Sem financês</h2>
          <p className="max-w-3xl text-lg leading-8 opacity-90">
            O Clareza Financeira troca termos difíceis por frases práticas: entrou, saiu, sobrou, faltam pagar, pode gastar e atenção.
          </p>
        </div>
      </section>

      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-8 text-sm text-muted-foreground sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <span>Clareza Financeira</span>
          <div className="flex flex-wrap gap-4">
            <Link href="/sobre">Sobre</Link>
            <Link href="/privacidade">Privacidade</Link>
            <Link href="/termos">Termos</Link>
            <Link href="/login">Entrar</Link>
          </div>
        </div>
      </footer>
    </main>
  )
}
