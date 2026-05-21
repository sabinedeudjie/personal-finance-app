import { Controller, Get, Post, Put, Delete,
    Body, Param, Query, Request, UseGuards } from '@nestjs/common'
import { TransactionsService } from './transactions.service'
import { JwtAuthGuard } from '../auth/jwt-auth.guard'
import { Request as ExpressRequest } from 'express'
import type { TransactionFilters } from "src/interfaces/transaction-filters.interface"
import type {CreateTransactionData} from "../interfaces/create-transaction-data.interface";

interface AuthRequest extends ExpressRequest {
    user: { userId: string }
}


@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
    constructor(private transactionsService: TransactionsService) {}

    @Get()
    findAll(@Request() req:AuthRequest, @Query() query:TransactionFilters) {
        return this.transactionsService.findAll(req.user.userId, query)
    }

    @Post()
    create(@Request() req:AuthRequest, @Body() body:CreateTransactionData) {
        return this.transactionsService.create(req.user.userId, body)
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() body:Partial<CreateTransactionData>) {
        return this.transactionsService.update(id, body)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.transactionsService.remove(id)
    }
}