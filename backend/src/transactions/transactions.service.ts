import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TransactionFilters } from '../interfaces/transaction-filters.interface';
import { CreateTransactionData } from '../interfaces/create-transaction-data.interface';
import { TransactionResponse } from '../interfaces/transaction.interface';

@Injectable()
export class TransactionsService {
  constructor(private prisma: PrismaService) {}

  findAll(
    user_id: string,
    filters: TransactionFilters,
  ): Promise<TransactionResponse[]> {
    const {
      from,
      to,
      type,
      category_id,
      search,
      skip = 0,
      take = 20,
    } = filters;

    const s = search?.toLowerCase().trim() || '';
    const searchIsIncome = s.startsWith('rev') || s === 'income';
    const searchIsExpense =
      s.startsWith('dep') || s.startsWith('dép') || s === 'expense';

    let dateFilter: any = undefined;
    // Si la recherche ressemble à une année (ex: 2024)
    if (/^\d{4}$/.test(s)) {
      dateFilter = {
        gte: new Date(`${s}-01-01T00:00:00.000Z`),
        lte: new Date(`${s}-12-31T23:59:59.999Z`),
      };
    }
    // Si c'est une date valide complète (ex: 2024-05-10 ou 10/05/2024 selon le navigateur)
    else if (s && !isNaN(Date.parse(s))) {
      const parsedDate = new Date(s);
      dateFilter = {
        gte: new Date(parsedDate.setHours(0, 0, 0, 0)),
        lte: new Date(parsedDate.setHours(23, 59, 59, 999)),
      };
    }

    const searchConditions = search
      ? {
          OR: [
            { notes: { contains: search } },
            { category: { name: { contains: search } } },
            ...(searchIsIncome ? [{ type: 'income' as any }] : []),
            ...(searchIsExpense ? [{ type: 'expense' as any }] : []),
            ...(!isNaN(Number(search)) ? [{ amount: Number(search) }] : []),
            ...(dateFilter ? [{ date: dateFilter }] : []),
          ],
        }
      : {};

    return this.prisma.transaction.findMany({
      where: {
        user_id,
        ...(type ? { type: type as any } : {}),
        ...(category_id ? { category_id } : {}),
        ...searchConditions,
        ...(from || to
          ? {
              date: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            }
          : {}),
      },
      include: { category: true },
      orderBy: { date: 'desc' },
      skip: Number(skip),
      take: Number(take),
    }) as unknown as Promise<TransactionResponse[]>;
  }

  create(
    user_id: string,
    data: CreateTransactionData,
  ): Promise<TransactionResponse> {
    return this.prisma.transaction.create({
      data: { ...data, date: new Date(data.date), user_id },
      include: { category: true },
    }) as unknown as Promise<TransactionResponse>;
  }

  update(
    id: string,
    data: Partial<CreateTransactionData>,
  ): Promise<TransactionResponse> {
    return this.prisma.transaction.update({
      where: { id },
      data: { ...data, ...(data.date ? { date: new Date(data.date) } : {}) },
    }) as unknown as Promise<TransactionResponse>;
  }

  remove(id: string) {
    return this.prisma.transaction.delete({ where: { id } });
  }
}
