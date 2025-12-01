import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  UseGuards,
  Req,
} from '@nestjs/common';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { MatriculasService } from './matricula.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorators/role.decorator';
import * as express from 'express';

@ApiTags('Matrículas')
@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly service: MatriculasService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({ summary: 'Cria uma nova matrícula para o aluno autenticado' })
  create(@Body() dto: CreateMatriculaDto, @Req() req: express.Request) {
    return this.service.create(req.user!.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get('cursadas')
  @ApiOperation({
    summary: 'Lista as disciplinas já cursadas pelo aluno autenticado',
  })
  async disciplinasCursadas(@Req() req: express.Request) {
    return this.service.listarDisciplinasCursadas(req.user!.id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Get()
  @ApiOperation({ summary: 'Retorna todas as matrículas cadastradas (ADMIN)' })
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({ summary: 'Retorna uma matrícula pelo ID' })
  findOne(@Param('id', ParseIntPipe) id: number, @Req() req: express.Request) {
    return this.service.findOne(id, req.user!.id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza uma matrícula existente' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatriculaDto,
    @Req() req: express.Request,
  ) {
    return this.service.update(id, req.user!.id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({ summary: 'Remove uma matrícula do sistema' })
  remove(@Param('id', ParseIntPipe) id: number, @Req() req: express.Request) {
    return this.service.remove(id, req.user!.id);
  }
}
