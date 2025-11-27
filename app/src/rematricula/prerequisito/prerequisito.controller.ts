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
} from '@nestjs/common';
import { CreatePreRequisitoDto } from './dto/create-prerequisito.dto';
import { UpdatePreRequisitoDto } from './dto/update-prerequisito.dto';
import { PreRequisitosService } from './prerequisito.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorators/role.decorator';

@ApiTags('Pré Requisitos')
@Controller('prerequisitos')
export class PreRequisitosController {
  constructor(private readonly service: PreRequisitosService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({
    summary: 'Cria um novo pré-requisito de disciplina',
  })
  @ApiResponse({
    status: 200,
    description: 'Pré-requisito criado com sucesso!',
  })
  create(@Body() dto: CreatePreRequisitoDto) {
    return this.service.create(dto);
  }

  @Get()
  @ApiOperation({
    summary: 'Retorna os pré-requisitos cadastrados no sistema',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações dos pré-requisitos cadastrados no sistema**',
  })
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Retorna o pré-requisito com o id informado',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações do pré-requisito com o id informado**',
  })
  @ApiResponse({
    status: 404,
    description: 'Pré-requisito com ID **id** não encontrado',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza um pré-requisito existente no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Pré-requisito atualizado com sucesso!',
  })
  @ApiResponse({
    status: 404,
    description: 'Pré-requisito com ID **id** não encontrado',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePreRequisitoDto,
  ) {
    return this.service.update(id, dto);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta um pré-requisito no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Pré-requisito removido com sucesso!',
  })
  @ApiResponse({
    status: 404,
    description: 'Pré-requisito com ID **id** não encontrado',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
