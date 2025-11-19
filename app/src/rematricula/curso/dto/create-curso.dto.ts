import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCursoDto {
  @ApiProperty({
    description: 'Nome do curso',
    example: 'Engenharia de Software',
  })
  @IsNotEmpty()
  @IsString()
  nome!: string;

  @ApiProperty({ description: 'Sigla do curso', example: 'ESW' })
  @IsNotEmpty()
  @IsString()
  sigla!: string;
}
