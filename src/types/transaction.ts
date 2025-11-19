export type TransactionType = "income" | "expense";

export type Category =
  | "Alimentação"
  | "Transporte"
  | "Moradia"
  | "Contas"
  | "Lazer"
  | "Salário"
  | "Outros";

export interface Transaction {
  id: string;
  description: string;
  amount: number;
  category: Category;
  date: Date;
  type: TransactionType;
}
