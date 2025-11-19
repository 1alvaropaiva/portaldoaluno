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
import { CreatePreRequisitoDto } from './dto/create-prerequisito.dto';
import { UpdatePreRequisitoDto } from './dto/update-prerequisito.dto';
import { PreRequisitosService } from './prerequisito.service';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('Pré Requisitos')
@Controller('prerequisitos')
export class PreRequisitosController {
  constructor(private readonly service: PreRequisitosService) {}

  @Post()
  create(@Body() dto: CreatePreRequisitoDto) {
    return this.service.create(dto);
  }

  @Get()
  findAll() {
    return this.service.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.service.findOne(id);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdatePreRequisitoDto,
  ) {
    return this.service.update(id, dto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.service.remove(id);
  }
}
