import { MessageCircleHeart } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function SimpleSummaryCard({ text }: { text: string }) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <MessageCircleHeart aria-hidden="true" />
          Resumo simples
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-base leading-7 text-muted-foreground">{text}</p>
      </CardContent>
    </Card>
  )
}
