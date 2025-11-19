import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  ForbiddenException,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import express from 'express';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Post()
  create(@Body() dto: CreateAdminDto) {
    return this.adminService.create(dto);
  }

  @Get()
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(AuthGuard)
  @Put('update')
  async updateSelf(@Body() dto: UpdateAdminDto, @Req() req: express.Request) {
    if (!req.user) {
      throw new ForbiddenException('Admin não autenticado');
    }
    return this.adminService.update(req.user.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get('dashboard')
  async dashboard(@Req() req: express.Request) {
    if (!req.user) {
      throw new ForbiddenException('Admin não autenticado');
    }

    const admin = await this.adminService.findOne(req.user.id);

    return {
      mensagem: `Painel administrativo - Bem-vindo, ${admin.nome}`,
      cargo: admin.cargo,
    };
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  async remove(
    @Param('id', ParseIntPipe) id: number,
    @Req() req: express.Request,
  ) {
    if (!req.user) {
      throw new ForbiddenException('Admin não autenticado');
    }

    if (req.user.id !== id) {
      throw new ForbiddenException('Você só pode remover sua própria conta');
    }

    await this.adminService.remove(id);
    return 'Admin removido com sucesso';
  }
}
