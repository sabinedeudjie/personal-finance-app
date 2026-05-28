import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './auth.strategy';
import { PrismaModule } from '../prisma/prisma.module'; 

@Module({
  imports: [
    PrismaModule, // Permet à AuthService de parler à PostgreSQL via Prisma
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'SUPER_SECRET_KEY_GABY',
      signOptions: { expiresIn: '1h' }, // Le token expire après 1 heure
    }),
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
  exports: [AuthService], // Permet à tes amis d'utiliser ton authentification si besoin
})
export class AuthModule {}