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
} from '@nestjs/common';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { TurmasService } from './turma.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Turmas')
@Controller('turmas')
export class TurmasController {
  constructor(private readonly turmasService: TurmasService) {}

  @Post()
  create(@Body() dto: CreateTurmaDto) {
    return this.turmasService.create(dto);
  }

  @Get()
  findAll(@Query('periodo') periodo?: string) {
    return this.turmasService.findAll(periodo);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.turmasService.findOne(id);
  }

  @Put(':id')
  update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateTurmaDto) {
    return this.turmasService.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.turmasService.remove(id);
  }
}
