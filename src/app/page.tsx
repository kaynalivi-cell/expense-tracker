"use client";

import { useState, useMemo } from "react";
import { useExpenseStore } from "@/store/expenseStore";
import { Dashboard } from "@/components/Dashboard";
import { TransactionForm } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { FilterBar, FilterType, PeriodType } from "@/components/FilterBar";
import { CategoryChart } from "@/components/CategoryChart";
import { IncomeExpenseChart } from "@/components/IncomeExpenseChart";
import { Category } from "@/types/transaction";
import { Wallet } from "lucide-react";
import {
  isToday,
  isThisWeek,
  isThisMonth,
  startOfDay,
  startOfWeek,
  startOfMonth
} from "date-fns";

export default function Home() {
  const transactions = useExpenseStore((state) => state.transactions);

  // Estados dos filtros
  const [filterType, setFilterType] = useState<FilterType>("all");
  const [filterCategory, setFilterCategory] = useState<Category | "all">("all");
  const [filterPeriod, setFilterPeriod] = useState<PeriodType>("all");

  // Lógica de filtros
  const filteredTransactions = useMemo(() => {
    return transactions.filter((transaction) => {
      // Filtro por tipo
      if (filterType !== "all" && transaction.type !== filterType) {
        return false;
      }

      // Filtro por categoria
      if (filterCategory !== "all" && transaction.category !== filterCategory) {
        return false;
      }

      // Filtro por período
      const transactionDate = new Date(transaction.date);
      switch (filterPeriod) {
        case "today":
          if (!isToday(transactionDate)) return false;
          break;
        case "week":
          if (!isThisWeek(transactionDate, { weekStartsOn: 0 })) return false;
          break;
        case "month":
          if (!isThisMonth(transactionDate)) return false;
          break;
        case "all":
        default:
          break;
      }

      return true;
    });
  }, [transactions, filterType, filterCategory, filterPeriod]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl shadow-lg">
              <Wallet className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                Gerenciador de Despesas
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Controle suas finanças de forma simples e eficiente
              </p>
            </div>
          </div>
        </header>

        {/* Dashboard - Cards de Resumo */}
        <div className="mb-8">
          <Dashboard />
        </div>

        {/* Análise Visual - Gráficos */}
        {transactions.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-semibold mb-4">Análise Visual</h2>
            <div className="grid gap-6 md:grid-cols-2">
              <IncomeExpenseChart />
              <CategoryChart />
            </div>
          </div>
        )}

        {/* Botão Nova Transação e Filtros */}
        <div className="flex flex-col gap-4 mb-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Transações</h2>
            <TransactionForm />
          </div>

          {/* Barra de Filtros */}
          {transactions.length > 0 && (
            <FilterBar
              filterType={filterType}
              filterCategory={filterCategory}
              filterPeriod={filterPeriod}
              onFilterTypeChange={setFilterType}
              onFilterCategoryChange={setFilterCategory}
              onFilterPeriodChange={setFilterPeriod}
            />
          )}
        </div>

        {/* Lista de Transações */}
        <div>
          {transactions.length === 0 ? (
            // Estado vazio - Primeira vez
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-6 bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-full mb-6">
                <Wallet className="h-16 w-16 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-center">
                Nenhuma transação ainda
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Comece a controlar suas finanças adicionando sua primeira transação.
                É rápido e fácil!
              </p>
              <TransactionForm />
            </div>
          ) : filteredTransactions.length === 0 ? (
            // Estado vazio - Filtros não retornaram resultados
            <div className="flex flex-col items-center justify-center py-16 px-4">
              <div className="p-6 bg-gradient-to-br from-amber-100 to-orange-100 dark:from-amber-900/20 dark:to-orange-900/20 rounded-full mb-6">
                <Wallet className="h-16 w-16 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-2xl font-semibold mb-2 text-center">
                Nenhuma transação encontrada
              </h3>
              <p className="text-muted-foreground text-center mb-6 max-w-md">
                Tente ajustar os filtros para ver mais transações.
              </p>
            </div>
          ) : (
            // Lista de transações filtradas
            <TransactionList transactions={filteredTransactions} />
          )}
        </div>

        {/* Footer */}
        {transactions.length > 0 && (
          <footer className="mt-8 text-center text-sm text-muted-foreground">
            <p>
              Mostrando {filteredTransactions.length} de {transactions.length}{" "}
              {transactions.length === 1 ? "transação" : "transações"}
            </p>
          </footer>
        )}
      </div>
    </div>
  );
}
