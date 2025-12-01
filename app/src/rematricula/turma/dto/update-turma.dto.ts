import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateTurmaDto {
  @ApiPropertyOptional({ description: 'Novo professor' })
  @IsOptional()
  @IsString()
  professor?: string;

  @ApiPropertyOptional({ description: 'Novo horário' })
  @IsOptional()
  @IsString()
  horario?: string;

  @ApiPropertyOptional({ description: 'Novo período letivo' })
  @IsOptional()
  @IsNumber()
  periodoLetivo?: number;
}
