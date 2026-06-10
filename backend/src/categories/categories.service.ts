import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CategoriesService {
  constructor(private prisma: PrismaService) {}

  findAll(user_id: string, search?: string, type?: string) {
    const s = search?.toLowerCase().trim() || '';
    const searchIsIncome = s.startsWith('rev') || s === 'income';
    const searchIsExpense =
      s.startsWith('dep') || s.startsWith('dép') || s === 'expense';

    return this.prisma.category.findMany({
      where: {
        AND: [
          { OR: [{ user_id }, { user_id: null }] },
          search
            ? {
                OR: [
                  { name: { contains: search } },
                  ...(searchIsIncome ? [{ type: 'income' as any }] : []),
                  ...(searchIsExpense ? [{ type: 'expense' as any }] : []),
                ],
              }
            : {},
          type ? { type: type as any } : {},
        ],
      },
    });
  }

  create(user_id: string, data: { name: string; type: string; icon?: string }) {
    return this.prisma.category.create({
      data: { ...data, user_id } as any,
    });
  }

  update(id: string, data: { name?: string; type?: string; icon?: string }) {
    return this.prisma.category.update({ where: { id }, data: data as any });
  }

  remove(id: string) {
    return this.prisma.category.delete({ where: { id } });
  }
}
