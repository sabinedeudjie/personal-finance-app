import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service.js';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto.js';
import { LoginDto } from './dto/login.dto.js';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto;

    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    });

    const payload = { email: newUser.email, sub: newUser.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Utilisateur créé avec succès !',
      accessToken,
      user: { id: newUser.id, email: newUser.email, name: newUser.name },
    };
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new UnauthorizedException('Email ou mot de passe invalide');
    }

    const payload = { email: user.email, sub: user.id };
    const accessToken = this.jwtService.sign(payload);

    return {
      message: 'Connexion réussie !',
      accessToken,
      user: { id: user.id, email: user.email, name: user.name },
    };
  }

  async refresh(oldToken: string | undefined) {
    if (!oldToken) {
      throw new UnauthorizedException('Token manquant');
    }
    try {
      const decoded = this.jwtService.verify(oldToken, {
        ignoreExpiration: true,
      });
      const payload = { email: decoded.email, sub: decoded.sub };
      return {
        accessToken: this.jwtService.sign(payload),
      };
    } catch (e) {
      throw new UnauthorizedException('Token invalide');
    }
  }

  async logout(userId: string) {
    // Avec un JWT simple (sans base de données pour les sessions),
    // la déconnexion se gère principalement côté client.
    return { message: 'Déconnexion réussie' };
  }
}
