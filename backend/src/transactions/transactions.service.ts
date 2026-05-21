import { Injectable } from '@nestjs/common';
import { PrismaService } from "prisma/prisma.service";
import {TransactionFilters} from "../interfaces/transaction-filters.interface";
import {CreateTransactionData} from "../interfaces/create-transaction-data.interface";

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService){}
    findAll(user_id:  string, filters: TransactionFilters) { const {from, to, type, category_id, skip =0 , take = 20} = filters;

        return this.prisma.transaction.findMany({
            where: {
                user_id,
                ...(type ? {type}: {}),
                ...(category_id ? {category_id}: {}),
                ...(from || to ?{
                    date: {
                        ...(from ? {gte: new Date(from)}: {}),
                        ...(to   ? {lte: new Date(to)  }: {}),


                    },
                }: {}),
            },
            include: {category: true},
            orderBy: {date: 'desc' },
            skip: Number(skip),
            take: Number(take),
        })
    }
    create(user_id: string, data: CreateTransactionData){
        return this.prisma.transaction.create({
            data: { ...data, date: new Date(data.date), user_id, },
        });
    }
    update(id: string, data: Partial<CreateTransactionData>){
        return this.prisma.transaction.update({
            where: {id},
            data: {...data, ...(data.date? {date: new Date(data.date)} : {}),

    },


        });
    }
    remove(id: string){
        return this.prisma.transaction.delete({where: {id}})
    }
}
