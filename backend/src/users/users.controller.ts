import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import {
  ApiTags,
  ApiBearerAuth,
  ApiResponse,
  ApiOperation,
} from '@nestjs/swagger';

@ApiTags('users')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // @Get()
  // @ApiOperation({ summary: 'Obtenir tous les utilisateurs (Restreint)' })
  // async findAll() {
  //   return this.usersService.findAll();
  // }

  @Get(':id')
  @ApiOperation({ summary: "Obtenir le profil d'un utilisateur" })
  @ApiResponse({ status: 200, description: "Le profil de l'utilisateur" })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async findOne(@Param('id') id: string, @Request() req) {
    if (req.user.userId !== id) {
      throw new ForbiddenException(
        'You are not authorized to view this user profile.',
      );
    }
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Mettre à jour le profil d'un utilisateur" })
  @ApiResponse({ status: 200, description: 'Le profil a été mis à jour' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    if (req.user.userId !== id) {
      throw new ForbiddenException(
        'You are not authorized to update this user profile.',
      );
    }
    return this.usersService.update(id, updateUserDto);
  }

  /*@Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT) // 204 No Content pour une suppression réussie
  @ApiOperation({ summary: "Supprimer le profil d'un utilisateur" })
  @ApiResponse({ status: 204, description: 'Le profil a été supprimé' })
  @ApiResponse({ status: 403, description: 'Accès interdit' })
  @ApiResponse({ status: 404, description: 'Utilisateur non trouvé' })
  async remove(@Param('id') id: string, @Request() req) {
    // Un utilisateur ne peut supprimer que son propre profil.
    if (req.user.userId !== id) {
      throw new ForbiddenException(
        'You are not authorized to delete this user profile.',
      );
    }
    await this.usersService.remove(id);
  }*/
}
