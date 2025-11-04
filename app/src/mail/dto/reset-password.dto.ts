/* eslint-disable */
import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class ResetPasswordDto {
  @ApiProperty({
    description: 'Token recebido por e-mail',
    example: 'a1b2c3d4',
  })
  @IsString()
  token: string;

  @ApiProperty({
    description: 'Nova senha desejada (mínimo 6 caracteres)',
    example: 'TesteSenha123',
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  newPassword: string;
}
