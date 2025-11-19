import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateCursoDto {
  @ApiPropertyOptional({ description: 'Novo nome do curso' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Nova sigla do curso' })
  @IsOptional()
  @IsString()
  sigla?: string;
}
