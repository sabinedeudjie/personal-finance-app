export interface CreateTransactionData {
  amount: number;
  date: string;
  type: 'income' | 'expense';
  category_id?: string;
  notes?: string;
}
