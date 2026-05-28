import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service'; 
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}


  async signUp(authDto: any) {
    const { email, password } = authDto;

    
    const userExists = await this.prisma.user.findUnique({ where: { email } });
    if (userExists) {
      throw new BadRequestException('Cet email est déjà utilisé');
    }

    
    const hashedPassword = await bcrypt.hash(password, 10);

    
    const newUser = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

    return {
      message: 'Utilisateur créé avec succès !',
      user: { id: newUser.id, email: newUser.email },
    };
  }
  
  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) return null;

    
    const isMatch = await bcrypt.compare(pass, user.password);
    if (isMatch) {
      const { password, ...result } = user;
      return result;
    }
    return null;
  }

  
  async login(user: any) {
    const payload = { email: user.email, sub: user.id };
    return {
      message: 'Connexion réussie !',
      token: this.jwtService.sign(payload),
      user: { id: user.id, email: user.email },
    };
  }
}