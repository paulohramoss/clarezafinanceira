"use client"

import { createContext, useContext } from "react"
import { useFinanceData } from "@/hooks/use-finance-data"

type FinanceContextValue = ReturnType<typeof useFinanceData>

const FinanceContext = createContext<FinanceContextValue | null>(null)

export function FinanceProvider({ children }: { children: React.ReactNode }) {
  const value = useFinanceData()
  return <FinanceContext.Provider value={value}>{children}</FinanceContext.Provider>
}

export function useFinance() {
  const context = useContext(FinanceContext)
  if (!context) {
    throw new Error("useFinance deve ser usado dentro de FinanceProvider")
  }
  return context
}
