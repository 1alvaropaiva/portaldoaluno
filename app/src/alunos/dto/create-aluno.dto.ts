import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateAlunoDto {
  @ApiProperty({ description: 'Nome do Aluno', example: 'João da Silva' })
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  @IsString({ message: 'O nome deve conter apenas letras' })
  nome!: string;

  @ApiProperty({ description: 'E-mail do aluno', example: 'test@test.com' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  @IsEmail({}, { message: 'E-mail inválido' })
  email!: string;

  @ApiProperty({ description: 'Senha de acesso (mínimo 6 caracteres)' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  senha!: string;

  @ApiProperty({ description: 'Matrícula do aluno', example: '202500123' })
  @IsNotEmpty({ message: 'A matrícula é obrigatória' })
  @IsString()
  matricula!: string;
}
