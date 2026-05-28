import Link from "next/link"

export default function PrivacyPage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-3xl flex-col gap-6 px-4 py-16">
      <Link href="/" className="text-sm font-medium text-muted-foreground">
        Clareza Financeira
      </Link>
      <h1 className="text-4xl font-semibold tracking-normal">Privacidade</h1>
      <p className="text-lg leading-8 text-muted-foreground">
        Dados financeiros são sensíveis. O Clareza Financeira armazena informações que você cadastra, como transações, contas, dívidas, metas, preferências e conversas do Copiloto, para exibir dashboard, relatórios e insights.
      </p>
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">O que não inserir</h2>
        <p className="leading-7 text-muted-foreground">
          Não informe senhas bancárias, códigos de segurança, tokens, número completo de cartão ou dados que permitam acesso à sua conta bancária.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">Exportar, anonimizar e excluir</h2>
        <p className="leading-7 text-muted-foreground">
          Na área de configurações você pode exportar transações em CSV, gerar um relatório mensal em PDF, baixar um resumo simples, anonimizar descrições e apagar todos os dados financeiros cadastrados.
        </p>
      </section>
      <section className="flex flex-col gap-3">
        <h2 className="text-2xl font-semibold">Como os dados são usados</h2>
        <p className="leading-7 text-muted-foreground">
          As informações são usadas para montar saldo, contas próximas, relatórios, alertas, metas e respostas do Copiloto. O sistema não promete ganhos, não recomenda investimentos específicos e não substitui contador, banco ou consultor financeiro.
        </p>
      </section>
    </main>
  )
}
