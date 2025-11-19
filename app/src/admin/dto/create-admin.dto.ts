import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({ description: 'Nome do administrador' })
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @ApiProperty({ description: 'E-mail do administrador' })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({ description: 'Senha de acesso (mínimo 6 caracteres)' })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha!: string;

  @ApiProperty({ description: 'Cargo administrativo', example: 'Coordenador' })
  @IsString()
  cargo!: string;
}
