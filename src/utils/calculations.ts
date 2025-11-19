import { Transaction, Category } from "@/types/transaction";

/**
 * Calcula o total de todas as receitas
 * @param transactions - Array de transações
 * @returns Soma de todas as receitas
 */
export function getTotalIncome(transactions: Transaction[]): number {
  return transactions
    .filter((transaction) => transaction.type === "income")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

/**
 * Calcula o total de todas as despesas
 * @param transactions - Array de transações
 * @returns Soma de todas as despesas
 */
export function getTotalExpenses(transactions: Transaction[]): number {
  return transactions
    .filter((transaction) => transaction.type === "expense")
    .reduce((sum, transaction) => sum + transaction.amount, 0);
}

/**
 * Calcula o saldo (receitas - despesas)
 * @param transactions - Array de transações
 * @returns Saldo total
 */
export function getBalance(transactions: Transaction[]): number {
  const income = getTotalIncome(transactions);
  const expenses = getTotalExpenses(transactions);
  return income - expenses;
}

/**
 * Agrupa transações por categoria e calcula o total de cada uma
 * @param transactions - Array de transações
 * @returns Objeto com categorias como chaves e totais como valores
 */
export function getTransactionsByCategory(
  transactions: Transaction[]
): Record<Category, number> {
  const categoryTotals: Record<Category, number> = {
    Alimentação: 0,
    Transporte: 0,
    Moradia: 0,
    Contas: 0,
    Lazer: 0,
    Salário: 0,
    Outros: 0,
  };

  transactions.forEach((transaction) => {
    categoryTotals[transaction.category] += transaction.amount;
  });

  return categoryTotals;
}
