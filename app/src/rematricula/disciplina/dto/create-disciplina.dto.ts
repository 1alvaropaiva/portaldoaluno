import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsNumber } from 'class-validator';

export class CreateDisciplinaDto {
  @ApiProperty({ description: 'Código da disciplina', example: 'MAT101' })
  @IsNotEmpty()
  @IsString()
  codigo!: string;

  @ApiProperty({
    description: 'Nome da disciplina',
    example: 'Matemática Básica',
  })
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @ApiProperty({ description: 'Carga horária em horas', example: 60 })
  @IsNotEmpty()
  @IsNumber()
  cargaHoraria!: number;

  @ApiProperty({ description: 'ID do curso ao qual pertence' })
  @IsNotEmpty()
  @IsNumber()
  cursoId!: number;
}
