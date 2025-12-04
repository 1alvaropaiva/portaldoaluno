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
import { ApiOperation, ApiQuery, ApiResponse, ApiTags } from '@nestjs/swagger';
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
  @ApiResponse({
    status: 404,
    description: 'Disciplica com ID *id* não encontrada.',
  })
  async create(@Body() dto: CreateTurmaDto) {
    await this.turmasService.create(dto);
    return 'Turma criada com sucesso!';
  }

  @UseGuards(AuthGuard)
  @Get()
  @ApiOperation({
    summary:
      'Retorna as turmas cadastradas no sistema (filtra por período se informado)',
  })
  @ApiQuery({
    name: 'periodo',
    required: false,
    type: String,
    description: 'Filtra por período letivo (opcional)',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações das turmas cadastradas no sistema**',
  })
  findAll(@Query('periodo') periodo?: string) {
    return this.turmasService.findAll(periodo);
  }

  @UseGuards(AuthGuard)
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
    description: 'Turma atualizada com sucesso! + dados da turma atualizada',
  })
  @ApiResponse({
    status: 404,
    description: 'Turma com ID **id** não encontrada',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateTurmaDto,
  ) {
    const turmaAtualizada = await this.turmasService.update(id, dto);

    return {
      message: 'Turma atualizada com sucesso!',
      data: turmaAtualizada,
    };
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta uma turma no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Turma com id *id* removida com sucesso!',
  })
  @ApiResponse({
    status: 404,
    description: 'Turma com ID **id** não encontrada',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.turmasService.remove(id);
    return 'Turma com id ${id} removida com sucesso!';
  }
}
