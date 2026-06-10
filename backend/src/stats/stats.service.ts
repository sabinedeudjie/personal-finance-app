import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StatsQueryDto } from './dto/stats-query.dto';
import { TransactionType } from '../generated/client/client.js';

@Injectable()
export class StatsService {
  constructor(private prisma: PrismaService) {}

  private parseDateRange(query: StatsQueryDto) {
    let { startDate, endDate, period } = query;
    if (period) {
      const now = new Date();
      switch (period) {
        case 'day':
          startDate = new Date(now.setHours(0, 0, 0, 0)).toISOString();
          endDate = new Date(now.setHours(23, 59, 59, 999)).toISOString();
          break;
        case 'week':
          const start = new Date(now);
          start.setDate(now.getDate() - now.getDay());
          start.setHours(0, 0, 0, 0);
          startDate = start.toISOString();
          endDate = new Date(now.setHours(23, 59, 59, 999)).toISOString();
          break;
        case 'month':
          startDate = new Date(
            now.getFullYear(),
            now.getMonth(),
            1,
          ).toISOString();
          endDate = new Date(
            now.getFullYear(),
            now.getMonth() + 1,
            0,
            23,
            59,
            59,
            999,
          ).toISOString();
          break;
        case 'year':
          startDate = new Date(now.getFullYear(), 0, 1).toISOString();
          endDate = new Date(
            now.getFullYear(),
            11,
            31,
            23,
            59,
            59,
            999,
          ).toISOString();
          break;
      }
    }
    return {
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    };
  }

  async getSummary(userId: string, query: StatsQueryDto) {
    const { startDate, endDate } = this.parseDateRange(query);
    const where: any = { userId };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const transactions = await this.prisma.transaction.findMany({
      where,
      select: { amount: true, type: true },
    });

    let income = 0,
      expense = 0;
    for (const t of transactions) {
      if (t.type === TransactionType.income) income += t.amount.toNumber();
      else expense += t.amount.toNumber();
    }

    return {
      income,
      expense,
      balance: income - expense,
      transactionCount: transactions.length,
      period: { startDate, endDate },
    };
  }

  async getCategoryBreakdown(userId: string, query: StatsQueryDto) {
    const { startDate, endDate } = this.parseDateRange(query);
    const where: any = {
      user_id: userId,
      type: TransactionType.expense,
    };
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date.gte = startDate;
      if (endDate) where.date.lte = endDate;
    }

    const result = await this.prisma.transaction.groupBy({
      by: ['category_id'],
      where,
      _sum: { amount: true },
      orderBy: { _sum: { amount: 'desc' } },
    });

    const categoryIds = result
      .map((r) => r.category_id)
      .filter((id): id is string => Boolean(id));
    const categories = await this.prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, icon: true },
    });
    const categoryMap = new Map(categories.map((c) => [c.id, c]));

    return result.map((r) => ({
      categoryId: r.category_id,
      categoryName: r.category_id
        ? categoryMap.get(r.category_id)?.name || 'Sans catégorie'
        : 'Sans Categorie',
      color: r.category_id
        ? categoryMap.get(r.category_id)?.icon || '#ccc'
        : '#ccc',
      total: r._sum?.amount ? Number(r._sum.amount) : 0,
    }));
  }

  async getMonthlyTrends(userId: string, year: number) {
    const startDate = new Date(year, 0, 1);
    const endDate = new Date(year, 11, 31, 23, 59, 59);

    const transactions = await this.prisma.transaction.findMany({
      where: {
        user_id: userId,
        date: { gte: startDate, lte: endDate },
      },
      select: { amount: true, type: true, date: true },
    });
    const monthly = Array(12)
      .fill(null)
      .map(() => ({ income: 0, expense: 0 }));
    for (const t of transactions) {
      const month = t.date.getMonth();
      if (t.type === TransactionType.income)
        monthly[month].income += t.amount.toNumber();
      else monthly[month].expense += t.amount.toNumber();
    }
    return monthly.map((m, idx) => ({
      month: idx + 1,
      monthName: new Date(year, idx, 1).toLocaleString('default', {
        month: 'short',
      }),
      income: m.income,
      expense: m.expense,
      balance: m.income - m.expense,
    }));
  }

  async getDailySpending(userId: string, query: StatsQueryDto) {
    const { startDate, endDate } = this.parseDateRange(query);
    if (!startDate || !endDate) {
      throw new BadRequestException(
        'Pour le détail journalier, fournissez startDate/endDate ou period',
      );
    }

    const transactions = await this.prisma.transaction.findMany({
      where: {
        user_id: userId,
        date: { gte: startDate, lte: endDate },
      },
      select: { amount: true, date: true, type: true },
    });

    const dailyMap = new Map<string, { income: number; expense: number }>();
    const current = new Date(startDate);
    while (current <= endDate) {
      const key = current.toISOString().split('T')[0];
      dailyMap.set(key, { income: 0, expense: 0 });
      current.setDate(current.getDate() + 1);
    }

    for (const t of transactions) {
      const key = t.date.toISOString().split('T')[0];
      const entry = dailyMap.get(key);
      if (entry) {
        if (t.type === TransactionType.income)
          entry.income += t.amount.toNumber();
        else entry.expense += t.amount.toNumber();
      }
    }

    return Array.from(dailyMap.entries()).map(([date, values]) => ({
      date,
      ...values,
      balance: values.income - values.expense,
    }));
  }
}
