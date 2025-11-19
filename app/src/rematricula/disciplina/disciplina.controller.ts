import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Put,
  Delete,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { DisciplinasService } from './disciplina.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Disciplinas')
@Controller('disciplinas')
export class DisciplinasController {
  constructor(private readonly disciplinasService: DisciplinasService) {}

  @Post()
  create(@Body() dto: CreateDisciplinaDto) {
    return this.disciplinasService.create(dto);
  }

  @Get()
  findAll() {
    return this.disciplinasService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.disciplinasService.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateDisciplinaDto,
  ) {
    return this.disciplinasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.disciplinasService.remove(id);
  }
}
