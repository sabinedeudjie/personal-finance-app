import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { TransactionsService } from './transactions.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { Request as ExpressRequest } from 'express';
import type { TransactionFilters } from '../interfaces/transaction-filters.interface.js';
import type { CreateTransactionData } from '../interfaces/create-transaction-data.interface.js';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

interface AuthRequest extends ExpressRequest {
  user: { userId: string; email: string; name: string | null };
}

@ApiTags('transactions')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private transactionsService: TransactionsService) {}

  @Get()
  @ApiOperation({ summary: "Obtenir toutes les transactions de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Liste des transactions' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  findAll(@Request() req: AuthRequest, @Query() query: TransactionFilters) {
    return this.transactionsService.findAll(req.user.userId, query);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle transaction' })
  @ApiResponse({
    status: 201,
    description: 'La transaction a été créée avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  create(@Request() req: AuthRequest, @Body() body: CreateTransactionData) {
    return this.transactionsService.create(req.user.userId, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une transaction existante' })
  @ApiResponse({
    status: 200,
    description: 'La transaction a été mise à jour avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Transaction non trouvée' })
  update(
    @Param('id') id: string,
    @Body() body: Partial<CreateTransactionData>,
  ) {
    return this.transactionsService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une transaction' })
  @ApiResponse({
    status: 204,
    description: 'La transaction a été supprimée avec succès',
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Transaction non trouvée' })
  remove(@Param('id') id: string) {
    return this.transactionsService.remove(id);
  }
}
