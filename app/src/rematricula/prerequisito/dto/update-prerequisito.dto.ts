import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsNumber } from 'class-validator';

export class UpdatePreRequisitoDto {
  @ApiPropertyOptional({ description: 'Novo ID da disciplina principal' })
  @IsOptional()
  @IsNumber()
  disciplinaId?: number;

  @ApiPropertyOptional({ description: 'Novo ID da disciplina requisito' })
  @IsOptional()
  @IsNumber()
  disciplinaRequisitoId?: number;
}
