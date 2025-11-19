"use client";

import { useState, useEffect } from "react";
import { useExpenseStore } from "@/store/expenseStore";
import { Transaction, Category, TransactionType } from "@/types/transaction";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus } from "lucide-react";
import { format } from "date-fns";

interface TransactionFormProps {
  transaction?: Transaction;
  mode?: "add" | "edit";
}

const categories: Category[] = [
  "Alimentação",
  "Transporte",
  "Moradia",
  "Contas",
  "Lazer",
  "Salário",
  "Outros",
];

export function TransactionForm({ transaction, mode = "add" }: TransactionFormProps) {
  const [open, setOpen] = useState(false);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState<Category>("Outros");
  const [type, setType] = useState<TransactionType>("expense");
  const [date, setDate] = useState(format(new Date(), "yyyy-MM-dd"));

  const addTransaction = useExpenseStore((state) => state.addTransaction);
  const updateTransaction = useExpenseStore((state) => state.updateTransaction);

  // Preencher formulário ao editar
  useEffect(() => {
    if (transaction && mode === "edit") {
      setDescription(transaction.description);
      setAmount(Math.abs(transaction.amount).toString());
      setCategory(transaction.category);
      setType(transaction.type);
      setDate(format(transaction.date, "yyyy-MM-dd"));
      setOpen(true);
    }
  }, [transaction, mode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validação básica
    if (!description.trim() || !amount || parseFloat(amount) <= 0) {
      alert("Por favor, preencha todos os campos corretamente.");
      return;
    }

    const transactionData = {
      description: description.trim(),
      amount: parseFloat(amount),
      category,
      type,
      date: new Date(date),
    };

    if (mode === "edit" && transaction) {
      updateTransaction(transaction.id, transactionData);
    } else {
      addTransaction(transactionData);
    }

    // Resetar formulário
    setDescription("");
    setAmount("");
    setCategory("Outros");
    setType("expense");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setOpen(false);
  };

  const handleCancel = () => {
    // Resetar formulário ao cancelar
    setDescription("");
    setAmount("");
    setCategory("Outros");
    setType("expense");
    setDate(format(new Date(), "yyyy-MM-dd"));
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {mode === "add" ? (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Nova Transação
          </Button>
        ) : (
          <Button variant="ghost" size="sm">
            Editar
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>
            {mode === "add" ? "Nova Transação" : "Editar Transação"}
          </DialogTitle>
          <DialogDescription>
            {mode === "add"
              ? "Adicione uma nova receita ou despesa"
              : "Edite os dados da transação"}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Tipo */}
            <div className="grid gap-2">
              <label htmlFor="type" className="text-sm font-medium">
                Tipo
              </label>
              <Select
                value={type}
                onValueChange={(value) => setType(value as TransactionType)}
              >
                <SelectTrigger id="type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="income">Receita</SelectItem>
                  <SelectItem value="expense">Despesa</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Descrição */}
            <div className="grid gap-2">
              <label htmlFor="description" className="text-sm font-medium">
                Descrição
              </label>
              <Input
                id="description"
                placeholder="Ex: Almoço, Salário..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </div>

            {/* Valor */}
            <div className="grid gap-2">
              <label htmlFor="amount" className="text-sm font-medium">
                Valor (R$)
              </label>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0.01"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
              />
            </div>

            {/* Categoria */}
            <div className="grid gap-2">
              <label htmlFor="category" className="text-sm font-medium">
                Categoria
              </label>
              <Select
                value={category}
                onValueChange={(value) => setCategory(value as Category)}
              >
                <SelectTrigger id="category">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Data */}
            <div className="grid gap-2">
              <label htmlFor="date" className="text-sm font-medium">
                Data
              </label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              {mode === "add" ? "Adicionar" : "Salvar"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
