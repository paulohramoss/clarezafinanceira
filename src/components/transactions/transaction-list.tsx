"use client"

import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { MoneyDisplay } from "@/components/ui-custom/money-display"
import { EmptyState } from "@/components/ui-custom/empty-state"
import type { Category, Transaction } from "@/types/finance"

function formatDate(date: string) {
  return new Intl.DateTimeFormat("pt-BR").format(new Date(`${date}T12:00:00`))
}

function categoryName(categories: Category[], id: string | null) {
  return categories.find((category) => category.id === id)?.name ?? "Sem categoria"
}

export function TransactionList({
  transactions,
  categories,
  currency,
  onEdit,
  onDelete,
}: {
  transactions: Transaction[]
  categories: Category[]
  currency: string
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
}) {
  return (
    <Card className="border-0 shadow-sm">
      <CardHeader>
        <CardTitle>Lista de transações</CardTitle>
      </CardHeader>
      <CardContent>
        {transactions.length === 0 ? (
          <EmptyState title="Nenhuma transação encontrada" description="Cadastre uma entrada ou saída para começar." />
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Descrição</TableHead>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Data</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {transactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-medium">{transaction.description}</TableCell>
                      <TableCell>{categoryName(categories, transaction.category_id)}</TableCell>
                      <TableCell>{formatDate(transaction.date)}</TableCell>
                      <TableCell>{transaction.type === "income" ? "Entrou" : "Saiu"}</TableCell>
                      <TableCell className="text-right">
                        <MoneyDisplay
                          value={transaction.amount}
                          currency={currency}
                          size="sm"
                          tone={transaction.type === "income" ? "positive" : "negative"}
                        />
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button type="button" variant="outline" size="sm" onClick={() => onEdit(transaction)}>
                            <Pencil data-icon="inline-start" />
                            Editar
                          </Button>
                          <Button type="button" variant="destructive" size="sm" onClick={() => onDelete(transaction.id)}>
                            <Trash2 data-icon="inline-start" />
                            Excluir
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex flex-col gap-3 md:hidden">
              {transactions.map((transaction) => (
                <article key={transaction.id} className="flex flex-col gap-3 rounded-xl border p-4">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold">{transaction.description}</h3>
                      <p className="text-sm text-muted-foreground">
                        {categoryName(categories, transaction.category_id)} · {formatDate(transaction.date)}
                      </p>
                    </div>
                    <MoneyDisplay
                      value={transaction.amount}
                      currency={currency}
                      size="sm"
                      tone={transaction.type === "income" ? "positive" : "negative"}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button type="button" variant="outline" onClick={() => onEdit(transaction)}>
                      <Pencil data-icon="inline-start" />
                      Editar
                    </Button>
                    <Button type="button" variant="destructive" onClick={() => onDelete(transaction.id)}>
                      <Trash2 data-icon="inline-start" />
                      Excluir
                    </Button>
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
