import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreatePreRequisitoDto {
  @ApiProperty({ description: 'ID da disciplina principal' })
  @IsNotEmpty()
  @IsNumber()
  disciplinaId!: number;

  @ApiProperty({ description: 'ID da disciplina que é pré-requisito' })
  @IsNotEmpty()
  @IsNumber()
  disciplinaRequisitoId!: number;
}
