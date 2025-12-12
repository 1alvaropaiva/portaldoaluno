import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UseGuards,
  Req,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import express from 'express';
import { AuthGuard } from '../auth/guard/auth.guard';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import {ApiBearerAuth, ApiOperation, ApiResponse} from '@nestjs/swagger';
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
  async create(@Body() dto: CreateAdminDto) {
    await this.adminService.create(dto);
    return {message: 'Admin criado com sucesso!'};
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('Token JWT')
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
  @ApiResponse({
    status: 401,
    description: 'Token inválido',
  })
  @ApiResponse({
      status: 403,
      description: 'Acesso negado: apenas admin pode acessar.',
  })
  findAll() {
    return this.adminService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('Token JWT')
  @Put('update')
  @ApiOperation({
    summary: 'Atualiza o admin autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Admin atualizado com sucesso!',
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
  async updateSelf(@Body() dto: UpdateAdminDto, @Req() req: express.Request) {
    await this.adminService.update(req.user!.id, dto);
    return {message: 'Admin atualizado com sucesso!'};
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('Token JWT')
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
  @ApiResponse({
      status: 403,
      description: 'Acesso negado: apenas admin pode acessar.',
  })
  async dashboard(@Req() req: express.Request) {
    const admin = await this.adminService.findOne(req.user!.id);
    return {
      mensagem: `Painel administrativo - Bem-vindo, ${admin.nome}`,
      cargo: admin.cargo,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth('Token JWT')
  @Delete(':id')
  @ApiOperation({
        summary: 'Remove o admin autenticado',
    })
  @ApiResponse({
        status: 200,
        description: 'Admin removido com sucesso!',
    })
  @ApiResponse({
        status: 401,
        description: 'Nenhum token fornecido ou token inválido',
    })
  @ApiResponse({
        status: 403,
        description: 'Você só pode remover sua própria conta',
    })
  @ApiResponse({
        status: 404,
        description: 'Admin não encontrado',
    })
  async remove(
      @Param('id', ParseIntPipe) id: number,
      @Req() req: express.Request,
  ) {
        await this.adminService.remove(id, req.user!);
        return {message: 'Admin removido com sucesso'};
    }
}
