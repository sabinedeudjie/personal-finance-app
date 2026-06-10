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
import { CategoriesService } from './categories.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js'; // guard de l'équipe auth
import { Request as ExpressRequest } from 'express';
import {
  ApiBearerAuth,
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

interface AuthRequest extends ExpressRequest {
  user: { userId: string; email: string; name: string | null };
}

@ApiTags('categories')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor(private categoriesService: CategoriesService) {}

  @Get()
  @ApiOperation({ summary: "Obtenir toutes les catégories de l'utilisateur" })
  @ApiResponse({ status: 200, description: 'Liste des catégories' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  findAll(
    @Request() req: AuthRequest,
    @Query('search') search?: string,
    @Query('type') type?: string,
  ) {
    return this.categoriesService.findAll(req.user.userId, search, type);
  }

  @Post()
  @ApiOperation({ summary: 'Créer une nouvelle catégorie' })
  @ApiResponse({
    status: 201,
    description: 'La catégorie a été créée avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  create(
    @Request() req: AuthRequest,
    @Body() body: { name: string; type: string; icon?: string },
  ) {
    return this.categoriesService.create(req.user.userId, body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour une catégorie existante' })
  @ApiResponse({
    status: 200,
    description: 'La catégorie a été mise à jour avec succès',
  })
  @ApiResponse({ status: 400, description: 'Requête invalide' })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  update(
    @Param('id') id: string,
    @Body() body: { name: string; type: string; icon?: string },
  ) {
    return this.categoriesService.update(id, body);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer une catégorie' })
  @ApiResponse({
    status: 204,
    description: 'La catégorie a été supprimée avec succès',
  })
  @ApiResponse({ status: 401, description: 'Non autorisé' })
  @ApiResponse({ status: 404, description: 'Catégorie non trouvée' })
  remove(@Param('id') id: string) {
    return this.categoriesService.remove(id);
  }
}
