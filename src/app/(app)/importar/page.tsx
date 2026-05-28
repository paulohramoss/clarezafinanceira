"use client"

import { useMemo, useState } from "react"
import { toast } from "sonner"
import { CheckCircle2, FileDown, Upload } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { PageTitle } from "@/components/layout/page-title"
import { useFinance } from "@/components/providers/finance-provider"
import { StatusBadge } from "@/components/ui-custom/status-badge"
import { formatCurrency } from "@/lib/finance/format-money"
import {
  buildTransactionsFromCsvRows,
  parseCsvFile,
  type CsvColumnMapping,
  type CsvParsedFile,
} from "@/lib/finance/csv-import"

const mappingLabels: Array<{ key: keyof CsvColumnMapping; label: string; required?: boolean }> = [
  { key: "date", label: "Data", required: true },
  { key: "description", label: "Descrição", required: true },
  { key: "amount", label: "Valor", required: true },
  { key: "type", label: "Tipo" },
  { key: "category", label: "Categoria" },
]

export default function ImportPage() {
  const { data, importTransactions } = useFinance()
  const [parsedFile, setParsedFile] = useState<CsvParsedFile | null>(null)
  const [mapping, setMapping] = useState<CsvColumnMapping | null>(null)

  const result = useMemo(() => {
    if (!parsedFile || !mapping) return null
    return buildTransactionsFromCsvRows({
      rows: parsedFile.rows,
      mapping,
      userId: data.profile.id,
      categories: data.categories,
      existingTransactions: data.transactions,
    })
  }, [data.categories, data.profile.id, data.transactions, mapping, parsedFile])

  const readFile = async (file: File | null) => {
    if (!file) return
    const text = await file.text()
    const parsed = parseCsvFile(text)
    setParsedFile(parsed)
    setMapping(parsed.suggestedMapping)
    if (parsed.errors.length) {
      toast.warning("O CSV abriu, mas algumas linhas precisam de atenção")
    } else {
      toast.success("CSV lido. Confira o preview antes de importar.")
    }
  }

  const errors = [...(parsedFile?.errors ?? []), ...(result?.errors ?? [])]
  const canImport = !!result && result.transactions.length > 0 && errors.length === 0

  return (
    <>
      <PageTitle
        title="Importar"
        description="Importe CSV com preview, mapeamento de colunas, detecção de entrada/saída e prevenção de duplicatas."
      />

      <Card className="border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileDown aria-hidden="true" />
            CSV de banco ou cartão
          </CardTitle>
          <CardDescription>
            O app tenta reconhecer colunas como data, descrição, valor, tipo e categoria automaticamente.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-5">
          <Alert>
            <AlertTitle>Antes de importar</AlertTitle>
            <AlertDescription>
              Confira o preview. Valores negativos viram saída, positivos viram entrada quando não houver coluna de tipo.
            </AlertDescription>
          </Alert>
          <Input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => readFile(event.target.files?.[0] ?? null)}
          />

          {parsedFile && mapping && (
            <div className="flex flex-col gap-4">
              <div className="grid gap-3 md:grid-cols-5">
                {mappingLabels.map((item) => (
                  <label key={item.key} className="flex flex-col gap-2 text-sm font-medium">
                    {item.label}
                    {item.required && <span className="text-xs font-normal text-muted-foreground">obrigatório</span>}
                    <select
                      value={mapping[item.key] || ""}
                      onChange={(event) => {
                        const value = event.target.value
                        setMapping((current) =>
                          current ? { ...current, [item.key]: value } : current,
                        )
                      }}
                      className="min-h-11 rounded-lg border border-input bg-background px-3 text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
                    >
                      <option value="">Não usar</option>
                      {parsedFile.headers.map((header) => (
                        <option key={header} value={header}>
                          {header}
                        </option>
                      ))}
                    </select>
                  </label>
                ))}
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Prontas para importar</p>
                  <p className="mt-1 text-2xl font-semibold">{result?.transactions.length ?? 0}</p>
                </div>
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Duplicatas ignoradas</p>
                  <p className="mt-1 text-2xl font-semibold">{result?.duplicateCount ?? 0}</p>
                </div>
                <div className="rounded-lg border bg-background p-4">
                  <p className="text-sm text-muted-foreground">Linhas com atenção</p>
                  <p className="mt-1 text-2xl font-semibold">{errors.length}</p>
                </div>
              </div>

              {errors.length > 0 && (
                <Alert className="border-[color:var(--cf-warning-border)] bg-[color:var(--cf-warning-soft)]">
                  <AlertTitle>Revise antes de importar</AlertTitle>
                  <AlertDescription>
                    <ul className="mt-2 flex flex-col gap-1">
                      {errors.slice(0, 6).map((error) => (
                        <li key={error}>{error}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {result && (
                <div className="rounded-lg border bg-background">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Status</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Descrição</TableHead>
                        <TableHead>Tipo</TableHead>
                        <TableHead>Categoria</TableHead>
                        <TableHead className="text-right">Valor</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.preview.slice(0, 12).map((row) => (
                        <TableRow key={row.id}>
                          <TableCell>
                            {row.error ? (
                              <StatusBadge status="risk" label="Revisar" />
                            ) : row.duplicate ? (
                              <StatusBadge status="attention" label="Duplicada" />
                            ) : (
                              <span className="inline-flex items-center gap-1 text-sm font-medium text-[color:var(--cf-success)]">
                                <CheckCircle2 aria-hidden="true" />
                                Nova
                              </span>
                            )}
                          </TableCell>
                          <TableCell>{row.date}</TableCell>
                          <TableCell className="max-w-[220px] truncate">{row.description}</TableCell>
                          <TableCell>{row.type === "income" ? "Entrada" : "Saída"}</TableCell>
                          <TableCell>{row.categoryName}</TableCell>
                          <TableCell className="text-right">{formatCurrency(row.amount, data.profile.currency)}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}

              <Button
                type="button"
                className="min-h-12 w-full text-base sm:w-fit"
                disabled={!canImport}
                onClick={async () => {
                  if (!result) return
                  await importTransactions(result.transactions)
                  toast.success("Transações importadas")
                  setParsedFile(null)
                  setMapping(null)
                }}
              >
                <Upload data-icon="inline-start" />
                Importar transações
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  )
}
