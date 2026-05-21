export interface CreateTransactionData {
    amount: number
    date: string
    type: string
    category_id?: string
    notes?: string
}