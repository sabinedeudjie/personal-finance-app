import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findOne(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }
    // Exclure le mot de passe pour des raisons de sécurité
    const { password, ...result } = user;
    return result;
  }

  async findAll() {
    const users = await this.prisma.user.findMany();
    // Exclure les mots de passe pour des raisons de sécurité
    return users.map(({ password, ...user }) => user);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(updateUserDto.password, 10);
    }
    try {
      const user = await this.prisma.user.update({
        where: { id },
        data: updateUserDto,
      });
      // Exclure le mot de passe pour des raisons de sécurité
      const { password, ...result } = user;
      return result;
    } catch (error) {
      // Gérer le cas où l'utilisateur n'est pas trouvé
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const user = await this.prisma.user.delete({ where: { id } });
      // Exclure le mot de passe pour des raisons de sécurité
      const { password, ...result } = user;
      return result;
    } catch (error) {
      // Gérer le cas où l'utilisateur n'est pas trouvé
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${id} not found`);
      }
      throw error;
    }
  }
}
