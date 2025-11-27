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
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { RolesGuard } from '../auth/guard/roles.guard';
import { Roles } from '../auth/decorators/role.decorator';

@Controller('admin')
export class AdminController {
  constructor(private readonly adminService: AdminService) {}
  @Post()
  @ApiOperation({
    summary: 'Cria um novo admin no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin criado com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  async create(@Body() dto: CreateAdminDto) {
    await this.adminService.create(dto);
    return 'Admin criado com sucesso!';
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({
    summary: 'Retorna a lista de admins',
  })
  @ApiResponse({
    status: 200,
    description: '*Admins cadastrados no sistema*',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put('update')
  @ApiOperation({
    summary: 'Atualiza um admin já cadastrado',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin atualizado com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  async updateSelf(@Body() dto: UpdateAdminDto, @Req() req: express.Request) {
    if (!req.user) {
      throw new ForbiddenException('Admin não autenticado');
    }
    await this.adminService.update(req.user.id, dto);
    return 'Admin atualizado com sucesso!';
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get('dashboard')
  @ApiOperation({
    summary: 'Dashboard do admin autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Painel administrativo - Bem-vindo, *nome do admin*!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
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

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove um admin existente',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin removido com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
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
