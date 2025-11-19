import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdminDto {
  @ApiPropertyOptional({ description: 'Novo nome' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Nova senha (mínimo 6 caracteres)' })
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;

  @ApiPropertyOptional({ description: 'Novo cargo' })
  @IsOptional()
  @IsString()
  cargo?: string;
}
