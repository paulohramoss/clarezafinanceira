"use client"

import { Building2, Pencil, Trash2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { EmptyState } from "@/components/ui-custom/empty-state"
import type { FinancialInstitution } from "@/types/finance"

function typeLabel(type: FinancialInstitution["type"]) {
  return {
    bank: "Banco tradicional",
    digital_bank: "Banco digital",
    wallet: "Carteira digital",
    broker: "Corretora",
    credit_union: "Cooperativa",
    other: "Outro",
  }[type]
}

function statusLabel(status: FinancialInstitution["status"]) {
  return status === "active" ? "Ativa" : "Inativa"
}

export function FinancialInstitutionList({
  institutions,
  onEdit,
  onDelete,
}: {
  institutions: FinancialInstitution[]
  onEdit: (institution: FinancialInstitution) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Instituições cadastradas</CardTitle>
      </CardHeader>
      <CardContent>
        {institutions.length === 0 ? (
          <EmptyState
            title="Nenhuma instituição cadastrada"
            description="Cadastre os bancos e carteiras que você usa para organizar melhor seu dinheiro."
          />
        ) : (
          <div className="grid gap-3 md:grid-cols-2">
            {institutions.map((institution) => (
              <article key={institution.id} className="flex min-w-0 flex-col gap-4 rounded-xl border p-4">
                <div className="flex min-w-0 items-start gap-3">
                  <span
                    className="flex size-11 shrink-0 items-center justify-center rounded-xl text-white"
                    style={{ backgroundColor: institution.color }}
                    aria-hidden="true"
                  >
                    <Building2 className="size-5" />
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="truncate font-semibold">{institution.name}</h3>
                      <Badge variant={institution.status === "active" ? "secondary" : "outline"}>
                        {statusLabel(institution.status)}
                      </Badge>
                    </div>
                    {institution.display_name && (
                      <p className="mt-1 text-sm text-muted-foreground">{institution.display_name}</p>
                    )}
                  </div>
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline">{typeLabel(institution.type)}</Badge>
                  <Badge variant="outline">{institution.color}</Badge>
                </div>

                {institution.notes && (
                  <p className="line-clamp-3 text-sm leading-6 text-muted-foreground">
                    {institution.notes}
                  </p>
                )}

                <div className="mt-auto grid gap-2 sm:grid-cols-2">
                  <Button type="button" variant="outline" onClick={() => onEdit(institution)}>
                    <Pencil data-icon="inline-start" />
                    Editar
                  </Button>
                  <Button type="button" variant="destructive" onClick={() => onDelete(institution.id)}>
                    <Trash2 data-icon="inline-start" />
                    Excluir
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
