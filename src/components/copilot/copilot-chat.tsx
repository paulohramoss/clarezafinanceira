"use client"

import { useState } from "react"
import { Bot, Send, UserRound } from "lucide-react"
import { toast } from "sonner"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { SuggestedQuestions } from "@/components/copilot/suggested-questions"
import { useFinance } from "@/components/providers/finance-provider"

type Message = {
  role: "user" | "assistant"
  content: string
}

export function CopilotChat() {
  const { summary } = useFinance()
  const [question, setQuestion] = useState("")
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Oi. Eu posso explicar seu mês com palavras simples. Não vou recomendar investimentos nem prometer resultado, mas posso ajudar você a entender entradas, saídas, contas e riscos de aperto.",
    },
  ])
  const [isSending, setIsSending] = useState(false)

  const ask = async (text: string) => {
    const trimmed = text.trim()
    if (!trimmed) return

    setQuestion("")
    setMessages((current) => [...current, { role: "user", content: trimmed }])
    setIsSending(true)

    try {
      const response = await fetch("/api/copilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          question: trimmed,
          summary: {
            availableBalance: summary.availableBalance,
            incomeThisMonth: summary.incomeThisMonth,
            expenseThisMonth: summary.expenseThisMonth,
            resultThisMonth: summary.resultThisMonth,
            upcomingBillsTotal: summary.upcomingBillsTotal,
            debtsTotal: summary.debtsTotal,
            safeToSpend: summary.safeToSpend,
            mainAlert: summary.mainAlert,
            topCategories: summary.spendingByCategory.slice(0, 5),
            nextBills: summary.nextBills.slice(0, 5),
          },
        }),
      })

      if (!response.ok) throw new Error("Resposta inválida")
      const data = (await response.json()) as { answer: string }
      setMessages((current) => [...current, { role: "assistant", content: data.answer }])
    } catch {
      toast.error("Não consegui responder agora")
      setMessages((current) => [
        ...current,
        {
          role: "assistant",
          content:
            "Tive um problema para responder. Mesmo assim, uma boa ação agora é olhar suas próximas contas e evitar gastos que não são essenciais até tudo ficar claro.",
        },
      ])
    } finally {
      setIsSending(false)
    }
  }

  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bot aria-hidden="true" />
          Copiloto financeiro
        </CardTitle>
        <CardDescription>
          Pergunte em linguagem comum. O Copiloto organiza a resposta com base nos seus dados.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <SuggestedQuestions onPick={ask} />

        <div className="flex max-h-[520px] flex-col gap-3 overflow-y-auto rounded-2xl border bg-background p-3">
          {messages.map((message, index) => (
            <div
              key={`${message.role}-${index}`}
              className={message.role === "user" ? "ml-auto max-w-[85%]" : "mr-auto max-w-[90%]"}
            >
              <div className="mb-1 flex items-center gap-2 text-xs font-medium text-muted-foreground">
                {message.role === "user" ? <UserRound aria-hidden="true" /> : <Bot aria-hidden="true" />}
                {message.role === "user" ? "Você" : "Copiloto"}
              </div>
              <div
                className={
                  message.role === "user"
                    ? "rounded-2xl bg-primary px-4 py-3 text-primary-foreground"
                    : "rounded-2xl bg-muted px-4 py-3"
                }
              >
                <p className="whitespace-pre-wrap text-sm leading-6">{message.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form
          className="flex flex-col gap-3 md:flex-row"
          onSubmit={(event) => {
            event.preventDefault()
            ask(question)
          }}
        >
          <Textarea
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Ex.: estou gastando muito?"
            className="min-h-24 flex-1"
          />
          <Button type="submit" className="min-h-12 md:self-end" disabled={isSending}>
            <Send data-icon="inline-start" />
            {isSending ? "Pensando..." : "Enviar"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
