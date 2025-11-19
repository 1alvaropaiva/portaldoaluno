import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateMatriculaDto {
  @ApiProperty({ description: 'ID da turma' })
  @IsNotEmpty()
  @IsNumber()
  turmaId!: number;
}
