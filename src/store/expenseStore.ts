import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Transaction } from "@/types/transaction";

interface ExpenseState {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, "id">) => void;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void;
  deleteTransaction: (id: string) => void;
}

export const useExpenseStore = create<ExpenseState>()(
  persist(
    (set) => ({
      transactions: [],

      addTransaction: (transaction) =>
        set((state) => ({
          transactions: [
            ...state.transactions,
            {
              ...transaction,
              id: crypto.randomUUID(),
            },
          ],
        })),

      updateTransaction: (id, updatedTransaction) =>
        set((state) => ({
          transactions: state.transactions.map((transaction) =>
            transaction.id === id
              ? { ...transaction, ...updatedTransaction }
              : transaction
          ),
        })),

      deleteTransaction: (id) =>
        set((state) => ({
          transactions: state.transactions.filter(
            (transaction) => transaction.id !== id
          ),
        })),
    }),
    {
      name: "expense-tracker-storage",
      storage: createJSONStorage(() => localStorage),
      // Serializar e desserializar datas corretamente
      partialize: (state) => ({
        transactions: state.transactions.map((t) => ({
          ...t,
          date: t.date.toISOString(),
        })),
      }),
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.transactions = state.transactions.map((t) => ({
            ...t,
            date: new Date(t.date),
          }));
        }
      },
    }
  )
);
