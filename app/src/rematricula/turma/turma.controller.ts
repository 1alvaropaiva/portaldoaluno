import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { TurmasService } from './turma.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorators/role.decorator';

@ApiTags('Turmas')
@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({
    summary: 'Cria uma nova turma no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Turma criada com sucesso!',
  })
  create(@Body() dto: CreateTurmaDto) {
    return this.turmasService.create(dto);
  }

  @Get()
  @ApiOperation({
    summary:
      'Retorna as turmas cadastradas no sistema (filtra por período se informado)',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações das turmas cadastradas no sistema**',
  })
  findAll(@Query('periodo') periodo?: string) {
    return this.turmasService.findAll(periodo);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna a turma com o id informado',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações da turma com o id informado**',
  })
  @ApiResponse({
    status: 404,
    description: 'Turma com ID **id** não encontrada',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turmasService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza uma turma existente no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Turma atualizada com sucesso!',
  })
  @ApiResponse({
    status: 404,
    description: 'Turma com ID **id** não encontrada',
  })
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTurmaDto) {
    return this.turmasService.update(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta uma turma no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Turma removida com sucesso!',
  })
  @ApiResponse({
    status: 404,
    description: 'Turma com ID **id** não encontrada',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turmasService.remove(id);
  }
}
