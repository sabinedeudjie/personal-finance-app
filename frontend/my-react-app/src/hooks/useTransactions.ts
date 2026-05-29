import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
    getTransactions,
    createTransaction,
    updateTransaction,
    deleteTransaction,
    TransactionFilters,
    CreateTransactionData,
} from '../services/api'

// ─── Hook principal
export function useTransactions(filters: TransactionFilters) {
    return useQuery({
        queryKey: ['transactions', filters], // recharge si filters change
        queryFn: () => getTransactions(filters),
    })
}

// ─── Hook création
export function useCreateTransaction() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (data: CreateTransactionData) => createTransaction(data),
        onSuccess: () => {
            // Recharge la liste après création
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })
}

// ─── Hook modification
export function useUpdateTransaction() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: Partial<CreateTransactionData> }) =>
            updateTransaction(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })
}

// ─── Hook suppression
export function useDeleteTransaction() {
    const queryClient = useQueryClient()

    return useMutation({
        mutationFn: (id: string) => deleteTransaction(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] })
        },
    })
}