import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import type { Request } from 'express';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AlunosService } from './alunos.service';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Get()
  @ApiOperation({ summary: 'Retorna todos os alunos cadastrados' })
  @ApiResponse({
    status: 200,
    description: '*Informações dos alunos cadastrados*',
  })
  findAll() {
    return this.alunosService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'aluno')
  @Put('update')
  @ApiOperation({
    summary: 'Atualiza o nome e/ou a senha do aluno autenticado',
  })
  @ApiResponse({
    status: 200,
    description: '*Mostra os dados atualizados, com hash de senha*',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  async updateSelf(@Body() dto: UpdateAlunoDto, @Req() req: Request) {
    if (!req.user) {
      throw new ForbiddenException('Aluno não autenticado');
    }
    return this.alunosService.update(req.user.id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza os dados de qualquer aluno (somente admin)',
  })
  @ApiResponse({
    status: 200,
    description: '*Mostra os dados atualizados, com hash de senha*',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: apenas **admin** pode acessar.',
  })
  async updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateAlunoDto,
  ) {
    return this.alunosService.adminUpdate(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('aluno')
  @Get('dashboard')
  @ApiOperation({
    summary: 'Dashboard do aluno autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Bem vindo, *nome do aluno*!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: apenas **aluno/admin** pode acessar.',
  })
  async dashboard(@Req() req: Request) {
    if (!req.user) {
      throw new ForbiddenException('Aluno não autenticado');
    }
    const aluno = await this.alunosService.findOne(req.user.id);
    return {
      mensagem: `Bem-vindo, ${aluno.nome}!`,
      matricula: aluno.matricula,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'aluno')
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta o aluno autenticado',
  })
  @ApiResponse({
    status: 200,
    description: '*Informações do aluno*',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    if (!req.user) {
      throw new ForbiddenException('Aluno não autenticado');
    }

    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw new ForbiddenException('Você só pode remover a sua própria conta');
    }

    await this.alunosService.remove(id);
    return 'Removido com sucesso!';
  }
}
