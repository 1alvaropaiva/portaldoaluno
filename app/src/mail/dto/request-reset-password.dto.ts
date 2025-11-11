import { ApiProperty } from '@nestjs/swagger';
import { IsEmail } from 'class-validator';

export class RequestResetPasswordDto {
  @ApiProperty({
    description: 'E-mail do aluno que solicitou a redefinição de senha',
    example: 'test@test.com',
  })
  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;
}
