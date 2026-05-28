import { NextResponse } from "next/server"
import { z } from "zod"
import { formatCurrency } from "@/lib/finance/format-money"

const requestSchema = z.object({
  question: z.string().min(2).max(800),
  summary: z.record(z.string(), z.unknown()),
})

const systemPrompt = `Você é um copiloto financeiro para pessoas comuns. Sua missão é explicar a situação financeira do usuário com linguagem simples, respeitosa e prática. Não use jargões. Não faça promessas. Não recomende investimentos específicos. Ajude o usuário a entender entradas, saídas, contas, dívidas, metas e riscos de aperto. Sempre dê passos práticos e realistas.`

function fallbackAnswer(question: string, summary: Record<string, unknown>) {
  const income = Number(summary.incomeThisMonth ?? 0)
  const expense = Number(summary.expenseThisMonth ?? 0)
  const balance = Number(summary.availableBalance ?? 0)
  const bills = Number(summary.upcomingBillsTotal ?? 0)
  const result = income - expense
  const safe = summary.safeToSpend as { safePerDay?: number; explanation?: string } | undefined

  const tone =
    result < 0 || balance - bills < 0
      ? "Seu mês está apertado."
      : result < income * 0.15
        ? "Seu mês pede atenção."
        : "Seu mês está sob controle por enquanto."

  return `${tone} Você recebeu ${formatCurrency(income)} e já gastou ${formatCurrency(expense)}. Seu saldo disponível é ${formatCurrency(balance)} e suas próximas contas somam ${formatCurrency(bills)}. ${safe?.safePerDay ? `Uma estimativa segura é gastar até ${formatCurrency(safe.safePerDay)} por dia.` : ""} Para agir agora: olhe as contas que vencem primeiro, evite compras não essenciais por alguns dias e revise os maiores gastos do mês.`
}

export async function POST(request: Request) {
  const payload = requestSchema.safeParse(await request.json())
  if (!payload.success) {
    return NextResponse.json({ answer: "Não consegui entender a pergunta. Tente escrever de forma simples." }, { status: 400 })
  }

  const apiKey = process.env.OPENAI_API_KEY
  const model = process.env.OPENAI_MODEL ?? "gpt-4.1-mini"

  if (!apiKey) {
    return NextResponse.json({
      answer: fallbackAnswer(payload.data.question, payload.data.summary),
    })
  }

  try {
    const OpenAI = (await import("openai")).default
    const client = new OpenAI({ apiKey })
    const response = await client.responses.create({
      model,
      input: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Pergunta: ${payload.data.question}\n\nResumo financeiro em JSON: ${JSON.stringify(payload.data.summary)}`,
        },
      ],
      temperature: 0.2,
    })

    return NextResponse.json({
      answer: response.output_text || fallbackAnswer(payload.data.question, payload.data.summary),
    })
  } catch {
    return NextResponse.json({
      answer: fallbackAnswer(payload.data.question, payload.data.summary),
    })
  }
}
