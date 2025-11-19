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
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Matrículas')
@Controller('matriculas')
export class MatriculasController {
  constructor(private readonly service: MatriculasService) {}

  @UseGuards(AuthGuard)
  @Post()
  create(@Body() dto: CreateMatriculaDto, @Req() req: express.Request) {
    return this.service.create(req.user!.id, dto);
  }

  @UseGuards(AuthGuard)
  @Get()
  findAll() {
    return this.service.findAll();
  }

  @UseGuards(AuthGuard)
  @Get('cursadas')
  async disciplinasCursadas(@Req() req: express.Request) {
    return this.service.listarDisciplinasCursadas(req.user!.id);
  }

  @UseGuards(AuthGuard)
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @UseGuards(AuthGuard)
  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateMatriculaDto,
  ) {
    return this.service.update(id, dto);
  }

  @UseGuards(AuthGuard)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
