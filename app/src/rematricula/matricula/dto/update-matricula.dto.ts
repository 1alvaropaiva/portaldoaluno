import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdateMatriculaDto {
  @ApiPropertyOptional({
    description: 'Situação da matrícula',
    example: 'cancelada',
  })
  @IsOptional()
  @IsString()
  situacao?: string;
}
