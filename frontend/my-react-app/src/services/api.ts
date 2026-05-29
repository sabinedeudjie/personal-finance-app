export interface TransactionFilters {
  from?: string;
  to?: string;
  type?: 'income' | 'expense';
  category_id?: string;
  skip?: number;
  take?: number;
}

export type CreateTransactionData = Omit<
    Transaction,
    'id' | 'created_at' | 'user_id' | 'category'
>;