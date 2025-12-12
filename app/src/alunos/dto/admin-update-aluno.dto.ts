import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';

export class AdminUpdateAlunoDto {
    @ApiPropertyOptional({
        description: 'Novo nome completo',
        example: '',
    })
    @IsOptional()
    @IsString()
    nome?: string;

    @ApiPropertyOptional({
        description: 'Novo e-mail',
        example: 'novo@email.com',
    })
    @IsOptional()
    @IsEmail()
    email?: string;

    @ApiPropertyOptional({
        description: 'Nova matrícula',
        example: '202512345',
    })
    @IsOptional()
    @IsString()
    matricula?: string;

    @ApiPropertyOptional({
        description: 'Nova senha (mínimo 6 caracteres)',
        example: 'NovaSenha@123',
    })
    @IsOptional()
    @IsString()
    @MinLength(6)
    novaSenha?: string;
}
