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

@Controller('alunos')
export class AlunosController {
  constructor(private readonly alunosService: AlunosService) {}

  @Get()
  findAll() {
    return this.alunosService.findAll();
  }

  @UseGuards(AuthGuard)
  @Put('update')
  async updateSelf(@Body() dto: UpdateAlunoDto, @Req() req: Request) {
    if (!req.user) {
      throw new ForbiddenException('Aluno não autenticado');
    }
    return this.alunosService.update(req.user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get('dashboard')
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

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    if (!req.user) {
      throw new ForbiddenException('Aluno não autenticado');
    }

    if (req.user.id !== id) {
      throw new ForbiddenException('Você só pode remover a sua própria conta');
    }

    await this.alunosService.remove(id);
    return 'Removido com sucesso!';
  }
}
