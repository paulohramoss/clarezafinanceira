import { PageTitle } from "@/components/layout/page-title"
import { CopilotChat } from "@/components/copilot/copilot-chat"

export default function CopilotPage() {
  return (
    <>
      <PageTitle
        title="Copiloto"
        description="Um assistente para explicar sua vida financeira sem jargões, promessas ou recomendações de investimento."
      />
      <CopilotChat />
    </>
  )
}
