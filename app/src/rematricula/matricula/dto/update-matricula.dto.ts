import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { SituacaoMatricula } from '../entities/matricula.entity';

export class UpdateMatriculaDto {
  @ApiPropertyOptional({
    description: 'Situação da matrícula',
    example: 'cancelada',
  })
  @IsOptional()
  @IsEnum(SituacaoMatricula)
  situacao?: SituacaoMatricula;
}
