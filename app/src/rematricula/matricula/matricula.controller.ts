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
import * as express from 'express';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { MatriculasService } from './matricula.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('Matrículas')
@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly service: MatriculasService) {}

  @UseGuards(AuthGuard)
  @Post()
  @ApiOperation({
    summary: 'Cria uma nova matrícula para o aluno autenticado',
  })
  @ApiResponse({
    status: 200,
    description: 'Matrícula criada com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  create(@Body() dto: CreateMatriculaDto, @Req() req: express.Request) {
    return this.service.create(req.user!.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Retorna todas as matrículas cadastradas no sistema',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações das matrículas cadastradas no sistema**',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('cursadas')
  @ApiOperation({
    summary: 'Lista as disciplinas já cursadas pelo aluno autenticado',
  })
  @ApiResponse({
    status: 200,
    description: '**Lista de disciplinas já cursadas pelo aluno**',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  async disciplinasCursadas(@Req() req: express.Request) {
    return this.service.listarDisciplinasCursadas(req.user!.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Retorna a matrícula com o id informado',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações da matrícula com o id informado**',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
    status: 404,
    description: 'Matrícula com ID **id** não encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza uma matrícula existente no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Matrícula atualizada com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
    status: 404,
    description: 'Matrícula com ID **id** não encontrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatriculaDto,
  ) {
    return this.service.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta uma matrícula no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Matrícula removida com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
    status: 404,
    description: 'Matrícula com ID **id** não encontrada',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
