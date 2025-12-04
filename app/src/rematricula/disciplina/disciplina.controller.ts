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
  Query,
} from '@nestjs/common';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { DisciplinasService } from './disciplina.service';
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorators/role.decorator';

@ApiTags('Disciplinas')
@Controller('disciplinas')
export class DisciplinasController {
  constructor(private readonly disciplinasService: DisciplinasService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({
    summary: 'Cria uma nova disciplina no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplina criada com sucesso!',
  })
  create(@Body() dto: CreateDisciplinaDto) {
    return this.disciplinasService.create(dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary: 'Retorna as disciplinas cadastradas no sistema (filtra por curso)',
  })
  @ApiQuery({
    name: 'idCurso',
    required: true,
    type: Number,
    description: 'ID do curso para filtrar as disciplinas',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações das disciplinas cadastradas no sistema**',
  })
  findAll(@Query('idCurso') idCurso: string) {
    return this.disciplinasService.findAll(Number(idCurso));
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  @ApiOperation({
    summary: 'Retorna a disciplina com o id informado',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações da disciplina com o id informado**',
  })
  @ApiResponse({
    status: 404,
    description: 'Disciplina com ID **id** não encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.disciplinasService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza uma disciplina existente no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplina atualizada com sucesso!',
  })
  @ApiResponse({
    status: 404,
    description: 'Disciplina com ID **id** não encontrada',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDisciplinaDto,
  ) {
    return this.disciplinasService.update(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta uma disciplina no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Disciplina removida com sucesso!',
  })
  @ApiResponse({
    status: 404,
    description: 'Disciplina com ID **id** não encontrada',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.disciplinasService.remove(id);
  }
}
