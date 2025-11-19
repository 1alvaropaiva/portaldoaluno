import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateTurmaDto {
  @ApiProperty({ description: 'ID da disciplina' })
  @IsNotEmpty()
  @IsNumber()
  disciplinaId!: number;

  @ApiProperty({ description: 'Professor responsável' })
  @IsNotEmpty()
  @IsString()
  professor!: string;

  @ApiProperty({ description: 'Horário da turma', example: 'Segunda 10h-12h' })
  @IsNotEmpty()
  @IsString()
  horario!: string;

  @ApiProperty({ description: 'Período letivo', example: '2025.1' })
  @IsNotEmpty()
  @IsString()
  periodoLetivo!: string;
}
