"use client";

import { useExpenseStore } from "@/store/expenseStore";
import { formatCurrency } from "@/utils/formatCurrency";
import { Transaction } from "@/types/transaction";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { TransactionForm } from "./TransactionForm";
import { useState } from "react";

interface TransactionListProps {
  transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
  const deleteTransaction = useExpenseStore((state) => state.deleteTransaction);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta transação?")) {
      deleteTransaction(id);
    }
  };

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center py-12">
          <p className="text-muted-foreground">
            Nenhuma transação encontrada. Adicione sua primeira transação!
          </p>
        </CardContent>
      </Card>
    );
  }

  // Ordenar por data (mais recentes primeiro)
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-3">
      {sortedTransactions.map((transaction) => (
        <Card key={transaction.id}>
          <CardContent className="flex items-center justify-between p-4">
            <div className="flex items-center gap-4 flex-1">
              {/* Badge de tipo */}
              <Badge
                variant={transaction.type === "income" ? "default" : "destructive"}
                className={
                  transaction.type === "income"
                    ? "bg-green-100 text-green-800 hover:bg-green-200"
                    : "bg-red-100 text-red-800 hover:bg-red-200"
                }
              >
                {transaction.type === "income" ? "Receita" : "Despesa"}
              </Badge>

              {/* Informações da transação */}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{transaction.description}</h3>
                  <span className="text-xs text-muted-foreground">
                    • {transaction.category}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  {format(new Date(transaction.date), "dd 'de' MMMM 'de' yyyy", {
                    locale: ptBR,
                  })}
                </p>
              </div>

              {/* Valor */}
              <div
                className={`text-lg font-bold ${
                  transaction.type === "income" ? "text-green-600" : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}
                {formatCurrency(transaction.amount)}
              </div>
            </div>

            {/* Botões de ação */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setEditingTransaction(transaction)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDelete(transaction.id)}
              >
                <Trash2 className="h-4 w-4 text-red-600" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}

      {/* Dialog de edição */}
      {editingTransaction && (
        <TransactionForm
          transaction={editingTransaction}
          mode="edit"
          key={editingTransaction.id}
        />
      )}
    </div>
  );
}
