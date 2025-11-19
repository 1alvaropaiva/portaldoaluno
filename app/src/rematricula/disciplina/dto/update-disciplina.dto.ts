import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsNumber } from 'class-validator';

export class UpdateDisciplinaDto {
  @ApiPropertyOptional({ description: 'Novo código da disciplina' })
  @IsOptional()
  @IsString()
  codigo?: string;

  @ApiPropertyOptional({ description: 'Novo nome da disciplina' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({ description: 'Nova carga horária' })
  @IsOptional()
  @IsNumber()
  cargaHoraria?: number;
}
