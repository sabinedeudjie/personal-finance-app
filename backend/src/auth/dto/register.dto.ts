import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'jean@exemple.com',
    description: "L'adresse email de l'utilisateur",
  })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({
    example: 'MotDePasse123!',
    description: "Le mot de passe de l'utilisateur (min 6 caractères)",
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  @MinLength(6, {
    message: 'Le mot de passe doit contenir au moins 6 caractères',
  })
  password: string;

  @ApiPropertyOptional({
    example: 'Jean Dupont',
    description: "Le nom complet de l'utilisateur",
  })
  @IsString()
  @IsOptional()
  name?: string;
}
