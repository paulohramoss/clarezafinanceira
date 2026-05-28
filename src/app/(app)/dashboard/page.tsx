"use client"

import { toast } from "sonner"
import { PageTitle } from "@/components/layout/page-title"
import { AlertCenterPreview } from "@/components/dashboard/alert-center-preview"
import { DailySummaryCard } from "@/components/dashboard/daily-summary-card"
import { FinancialOverviewCard } from "@/components/dashboard/financial-overview-card"
import { InsightsList } from "@/components/dashboard/insights-list"
import { MainAlertCard } from "@/components/dashboard/main-alert-card"
import { NextBestActionCard } from "@/components/dashboard/next-best-action-card"
import { SafeToSpendCard } from "@/components/dashboard/safe-to-spend-card"
import { SimpleSummaryCard } from "@/components/dashboard/simple-summary-card"
import { SpendingFocusCard } from "@/components/dashboard/spending-focus-card"
import { UpcomingBillsCard } from "@/components/dashboard/upcoming-bills-card"
import { useFinance } from "@/components/providers/finance-provider"

export default function DashboardPage() {
  const { data, summary, updateBill } = useFinance()
  const currency = data.profile.currency
  const simpleMode = data.profile.visual_mode === "simple"

  return (
    <>
      <PageTitle
        title="Dashboard"
        description="Veja se o mês está bem ou apertado, quanto pode gastar hoje, contas próximas e a próxima ação."
      />

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <FinancialOverviewCard summary={summary} currency={currency} />
        <DailySummaryCard summary={summary.dailySummary} currency={currency} />
      </section>

      <section className="grid gap-4 xl:grid-cols-3">
        <SafeToSpendCard result={summary.safeToSpend} currency={currency} />
        <NextBestActionCard action={summary.nextBestAction} />
        <MainAlertCard alert={summary.mainAlert} />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1fr_0.75fr]">
        <UpcomingBillsCard
          bills={summary.nextBills}
          currency={currency}
          onMarkPaid={async (bill) => {
            await updateBill({ ...bill, status: "paid" })
            toast.success("Conta marcada como paga")
          }}
        />
        <SpendingFocusCard summary={summary} currency={currency} />
      </section>

      <SimpleSummaryCard text={summary.simpleSummary} />

      {!simpleMode && (
        <>
          <InsightsList insights={summary.insights} />
          <AlertCenterPreview alerts={summary.alerts} />
        </>
      )}
    </>
  )
}
