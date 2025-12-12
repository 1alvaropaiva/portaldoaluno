import {
  Controller,
  Get,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
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
import {AdminUpdateAlunoDto} from "./dto/admin-update-aluno.dto";

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Retorna todos os alunos cadastrados (admin)' })
  @ApiResponse({
    status: 200,
    description: '*Informações dos alunos cadastrados*',
  })
  @ApiResponse({
      status: 401,
      description: 'Nenhum token fornecido',
  })
  @ApiResponse({
      status: 401,
      description: 'Token inválido',
  })
  findAll() {
    return this.alunosService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles( 'aluno' )
  @Put('update')
  @ApiOperation({
    summary: 'Atualiza o nome e/ou a senha do aluno autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Dados atualizados com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
      status: 401,
      description: 'Token inválido',
  })
  @ApiResponse({
      status: 403,
      description: 'Acesso negado: apenas aluno pode acessar.',
  })
  async updateSelf(@Body() dto: UpdateAlunoDto, @Req() req: Request) {
      await this.alunosService.update(req.user!.id, dto);
      return {
          mensagem: 'Dados atualizados com sucesso!'
      };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza os dados de qualquer aluno (somente admin)',
  })
  @ApiResponse({
    status: 200,
    description: 'Aluno atualizado com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
      status: 401,
      description: 'Token inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: apenas admin pode acessar.',
  })
  async updateByAdmin(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: AdminUpdateAlunoDto,
  ) {
    await this.alunosService.adminUpdate(id, dto);
      return {
          mensagem: 'Aluno atualizado com sucesso!'
      };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('aluno')
  @Get('dashboard')
  @ApiOperation({
    summary: 'Dashboard do aluno autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Bem vindo, *nome do aluno*!' +
        '*matricula do aluno*',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
      status: 401,
      description: 'Token inválido',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: apenas aluno pode acessar.'
  })
  @ApiResponse({
      status: 403,
      description: 'Aluno não autenticado.'
  })
  @ApiResponse({
      status: 403,
      description: 'Você não tem permissão para acessar esse aluno.'
  })
  async dashboard(@Req() req: Request) {
      const aluno = await this.alunosService.findOne(req.user!.id, req.user);
      return {
          mensagem: `Bem-vindo, ${aluno.nome}!`,
          matricula: aluno.matricula,
      };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'aluno')
  @Delete(':id')
  @ApiOperation({
      summary: 'Deleta um aluno (apenas o próprio aluno ou admin).',
  })
  @ApiResponse({
      status: 200,
      description: 'Aluno removido com sucesso.',
  })
  @ApiResponse({
      status: 401,
      description: 'Token inválido.',
  })
  @ApiResponse({
      status: 401,
      description: 'Nenhum token fornecido',
  })
  @ApiResponse({
      status: 403,
      description: 'Você não tem permissão para deletar outro aluno',
  })
  @ApiResponse({
      status: 404,
      description: 'Aluno não encontrado.',
  })
  async remove(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: Request,
  ) {
      await this.alunosService.remove(id, req.user!);
      return {
          mensagem: 'Aluno removido com sucesso!'
      };
  }
}
