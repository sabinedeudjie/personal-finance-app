import { CreateTransactionData } from './create-transaction-data.interface';

export interface TransactionResponse extends CreateTransactionData {
  id: string;
  user_id: string;
  created_at: Date;
  category?: {
    id: string;
    name: string;
    type: string;
    icon?: string;
  };
}
