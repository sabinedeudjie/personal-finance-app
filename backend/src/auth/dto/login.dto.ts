import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    example: 'jean@exemple.com',
    description: "L'adresse email de l'utilisateur",
  })
  @IsEmail({}, { message: 'Veuillez fournir une adresse email valide' })
  @IsNotEmpty({ message: "L'email est requis" })
  email: string;

  @ApiProperty({
    example: 'MotDePasse123!',
    description: "Le mot de passe de l'utilisateur",
  })
  @IsString()
  @IsNotEmpty({ message: 'Le mot de passe est requis' })
  password: string;
}
