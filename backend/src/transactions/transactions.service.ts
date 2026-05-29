import { Injectable } from '@nestjs/common';
import { PrismaService } from "../prisma/prisma.service";
import {TransactionFilters} from "../interfaces/transaction-filters.interface";
import {CreateTransactionData} from "../interfaces/create-transaction-data.interface";
import { TransactionResponse } from '../interfaces/transaction.interface';

@Injectable()
export class TransactionsService {
    constructor(private prisma: PrismaService){}
    findAll(user_id:  string, filters: TransactionFilters): Promise<TransactionResponse[]> { const {from, to, type, category_id, skip =0 , take = 20} = filters;

        return this.prisma.transaction.findMany({
            where: {
                user_id,
                ...(type ? {type: type as any}: {}),
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
        }) as unknown as Promise<TransactionResponse[]>;
    }
    create(user_id: string, data: CreateTransactionData): Promise<TransactionResponse>{
        return this.prisma.transaction.create({
            data: { ...data, date: new Date(data.date), user_id, },
            include: {category: true},
        }) as unknown as Promise<TransactionResponse>;
    }
    update(id: string, data: Partial<CreateTransactionData>): Promise<TransactionResponse> {
        return this.prisma.transaction.update({
            where: {id},
            data: {...data, ...(data.date ? {date: new Date(data.date)} : {})},
        }) as unknown as Promise<TransactionResponse>;
    }
    remove(id: string){
        return this.prisma.transaction.delete({where: {id}})
    }
}
