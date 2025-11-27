import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MinLength } from 'class-validator';

export class UpdateAdminDto {
  @ApiPropertyOptional({ description: 'Novo nome', example: 'Henrique' })
  @IsOptional()
  @IsString()
  nome?: string;

  @ApiPropertyOptional({
    description: 'Nova senha (mínimo 6 caracteres)',
    example: 'Henrique123',
  })
  @IsOptional()
  @IsString()
  @MinLength(6)
  senha?: string;

  @ApiPropertyOptional({ description: 'Novo cargo', example: 'Professor' })
  @IsOptional()
  @IsString()
  cargo?: string;
}
