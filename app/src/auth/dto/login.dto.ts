import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    description: 'E-mail cadastrado do aluno',
    example: 'alvaro@mail.com',
  })
  email!: string;

  @ApiProperty({
    description: 'Senha de acesso (mínimo 6 caracteres)',
    example: 'Senha@321',
  })
  senha!: string;

  @ApiProperty({
    description: 'Tipo de usuário: aluno ou admin',
    example: 'aluno',
  })
  tipo!: 'aluno' | 'admin';
}
