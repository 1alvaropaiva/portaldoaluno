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
import { PessoasService } from './pessoas.service';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';
import { AuthGuard } from '../auth/guard/auth.guard';

@Controller('pessoas')
export class PessoasController {
  constructor(private readonly pessoasService: PessoasService) {}

  @Get()
  findAll() {
    return this.pessoasService.findAll();
  }

  @UseGuards(AuthGuard)
  @Put('update')
  async updateSelf(@Body() dto: UpdatePessoaDto, @Req() req: Request) {
    if (!req.user) {
      throw new ForbiddenException('Usuário não autenticado');
    }
    return this.pessoasService.update(req.user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get('dashboard')
  async dashboard(@Req() req: Request) {
    if (!req.user) {
      throw new ForbiddenException('Usuário não autenticado');
    }
    const pessoa = await this.pessoasService.findOne(req.user.id);
    return {
      mensagem: `Bem-vindo, ${pessoa.nome}!`,
      matricula: pessoa.matricula,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number, @Req() req: Request) {
    if (!req.user) {
      throw new ForbiddenException('Usuário não autenticado');
    }

    if (req.user.id !== id) {
      throw new ForbiddenException('Você só pode remover a sua própria conta');
    }

    await this.pessoasService.remove(id);
    return 'Removido com sucesso!';
  }
}
