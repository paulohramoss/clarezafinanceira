"use client"

import { Button } from "@/components/ui/button"

export const suggestedQuestions = [
  "Me explique meu mês",
  "Posso gastar hoje?",
  "Quais contas tenho que pagar?",
  "Onde economizar?",
  "Estou no vermelho?",
  "Me explique como se eu fosse iniciante",
]

export function SuggestedQuestions({ onPick }: { onPick: (question: string) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {suggestedQuestions.map((question) => (
        <Button key={question} type="button" variant="outline" className="min-h-10" onClick={() => onPick(question)}>
          {question}
        </Button>
      ))}
    </div>
  )
}
