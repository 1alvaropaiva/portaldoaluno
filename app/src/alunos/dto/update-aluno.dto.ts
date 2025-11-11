import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAlunoDto {
  @ApiPropertyOptional({ description: 'Novo nome completo' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Senha atual (obrigatória para trocar a senha)',
  })
  @IsOptional()
  @IsString()
  senhaAtual?: string;

  @ApiPropertyOptional({
    description: 'Nova senha (mínimo 6 caracteres); requer senhaAtual',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  novaSenha?: string;
}
