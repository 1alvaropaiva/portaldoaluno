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
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';
import { CursosService } from './curso.service';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '../../auth/guard/auth.guard';
import { RolesGuard } from '../../auth/guard/roles.guard';
import { Roles } from '../../auth/decorators/role.decorator';

@ApiTags('Cursos')
@Controller('cursos')
export class CursosController {
  constructor(private readonly cursosService: CursosService) {}

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'aluno')
  @Get()
  @ApiOperation({
    summary: 'Retorna os cursos cadastrados no sistema',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações dos cursos cadastrados no sistema**',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  findAll() {
    return this.cursosService.findAll();
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin', 'aluno')
  @Get(':id')
  @ApiOperation({
    summary: 'Retorna o curso com o id informado',
  })
  @ApiResponse({
    status: 200,
    description: '**Informações do curso com o id informado**',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.cursosService.findOne(id);
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Post()
  @ApiOperation({
    summary: 'Cria um novo curso no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Curso criado com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: apenas admin pode acessar.',
  })
  async create(@Body() dto: CreateCursoDto) {
    await this.cursosService.create(dto);
    return 'Curso criado com sucesso!';
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Put(':id')
  @ApiOperation({
    summary: 'Atualiza um curso existente no sistema',
  })
  @ApiResponse({
    status: 200,
    description: '',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
    status: 403,
    description: 'Acesso negado: apenas admin pode acessar.',
  })
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateCursoDto,
  ) {
    await this.cursosService.update(id, dto);
    return 'Curso atualizado com sucesso!';
  }

  @UseGuards(AuthGuard, RolesGuard)
  @Roles('admin')
  @Delete(':id')
  @ApiOperation({
    summary: 'Deleta um curso no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Curso removido com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
  @ApiResponse({
    status: 400,
    description:
      'Não é possível remover este curso pois existem alunos vinculados a ele.',
  })
  @ApiResponse({
    status: 404,
    description: 'Curso com ID **id** não encontrado',
  })
  async remove(@Param('id', ParseIntPipe) id: number) {
    await this.cursosService.remove(id);
    return 'Curso removido com sucesso!';
  }
}
