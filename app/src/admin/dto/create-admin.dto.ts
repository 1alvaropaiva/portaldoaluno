import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsEmail, MinLength } from 'class-validator';

export class CreateAdminDto {
  @ApiProperty({
    description: 'Nome do administrador',
    example: 'Rubens Saviano',
  })
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @ApiProperty({
    description: 'E-mail do administrador',
    example: 'rubinho@mail.com',
  })
  @IsNotEmpty()
  @IsEmail()
  email!: string;

  @ApiProperty({
    description: 'Senha de acesso (mínimo 6 caracteres)',
    example: 'Rubens123',
  })
  @IsNotEmpty()
  @IsString()
  @MinLength(6)
  senha!: string;

  @ApiProperty({ description: 'Cargo administrativo', example: 'Professor' })
  @IsString()
  cargo!: string;
}
