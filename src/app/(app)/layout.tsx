import { AppFrame } from "@/components/layout/app-frame"
import { FinanceProvider } from "@/components/providers/finance-provider"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <FinanceProvider>
      <AppFrame>{children}</AppFrame>
    </FinanceProvider>
  )
}
