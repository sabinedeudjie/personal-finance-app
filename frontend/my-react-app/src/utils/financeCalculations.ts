import type { Transaction } from '../services/api';

export interface FinancialSummary {
  income: number;
  expense: number;
  balance: number;
}

export interface MonthlyDataPoint {
  month: string;
  income: number;
  expenses: number;
}

export interface CategoryAmount {
  category: string;
  amount: number;
}

export interface BalanceTrendPoint {
  month: string;
  balance: number;
}

export function computeSummary(transactions: Transaction[]): FinancialSummary {
  let income = 0;
  let expense = 0;

  for (const tx of transactions) {
    const amount = Number(tx.amount);
    if (tx.type === 'income') income += amount;
    else expense += amount;
  }

  return { income, expense, balance: income - expense };
}

export function computeMonthlyData(
  transactions: Transaction[],
  year = new Date().getFullYear()
): MonthlyDataPoint[] {
  const months = Array.from({ length: 12 }, (_, index) => ({
    month: new Date(year, index, 1).toLocaleDateString('fr-FR', { month: 'short' }),
    income: 0,
    expenses: 0,
  }));

  for (const tx of transactions) {
    const date = new Date(tx.date);
    if (date.getFullYear() !== year) continue;

    const amount = Number(tx.amount);
    const bucket = months[date.getMonth()];
    if (tx.type === 'income') bucket.income += amount;
    else bucket.expenses += amount;
  }

  return months;
}

export function computeCategoryBreakdown(transactions: Transaction[]): CategoryAmount[] {
  const totals = new Map<string, number>();

  for (const tx of transactions) {
    if (tx.type !== 'expense') continue;
    const label = tx.category?.name || 'Non classé';
    totals.set(label, (totals.get(label) || 0) + Number(tx.amount));
  }

  return Array.from(totals.entries())
    .map(([category, amount]) => ({ category, amount }))
    .sort((a, b) => b.amount - a.amount);
}

export function computeBalanceTrend(monthly: MonthlyDataPoint[]): BalanceTrendPoint[] {
  let cumulative = 0;

  return monthly.map((entry) => {
    cumulative += entry.income - entry.expenses;
    return { month: entry.month, balance: cumulative };
  });
}

function sumForMonth(
  transactions: Transaction[],
  year: number,
  month: number,
  type?: 'income' | 'expense'
): number {
  return transactions.reduce((total, tx) => {
    const date = new Date(tx.date);
    if (date.getFullYear() !== year || date.getMonth() !== month) return total;
    if (type && tx.type !== type) return total;
    return total + Number(tx.amount);
  }, 0);
}

function percentChange(current: number, previous: number): number | null {
  if (current === 0 && previous === 0) return null;
  if (previous === 0) return 100;
  return Number((((current - previous) / previous) * 100).toFixed(1));
}

export function computeTrends(transactions: Transaction[]): {
  balance: number | null;
  income: number | null;
  expense: number | null;
} {
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();
  const previousMonth = currentMonth === 0 ? 11 : currentMonth - 1;
  const previousYear = currentMonth === 0 ? currentYear - 1 : currentYear;

  const currentIncome = sumForMonth(transactions, currentYear, currentMonth, 'income');
  const previousIncome = sumForMonth(transactions, previousYear, previousMonth, 'income');
  const currentExpense = sumForMonth(transactions, currentYear, currentMonth, 'expense');
  const previousExpense = sumForMonth(transactions, previousYear, previousMonth, 'expense');
  const currentBalance = currentIncome - currentExpense;
  const previousBalance = previousIncome - previousExpense;

  return {
    balance: percentChange(currentBalance, previousBalance),
    income: percentChange(currentIncome, previousIncome),
    expense: percentChange(currentExpense, previousExpense),
  };
}
