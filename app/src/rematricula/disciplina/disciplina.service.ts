import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DisciplinaEntity } from './entities/disciplina.entity';
import { CreateDisciplinaDto } from './dto/create-disciplina.dto';
import { UpdateDisciplinaDto } from './dto/update-disciplina.dto';
import { CursoEntity } from '../curso/entities/curso.entity';

@Injectable()
export class DisciplinasService {
  constructor(
    @InjectRepository(DisciplinaEntity)
    private readonly repository: Repository<DisciplinaEntity>,
    @InjectRepository(CursoEntity)
    private readonly cursoRepository: Repository<CursoEntity>,
  ) {}

  async create(dto: CreateDisciplinaDto): Promise<DisciplinaEntity> {
    const curso = await this.cursoRepository.findOne({
      where: { id: dto.cursoId },
    });
    if (!curso)
      throw new NotFoundException(`Curso com ID ${dto.cursoId} não encontrado`);

    const disciplina = this.repository.create({
      codigo: dto.codigo,
      nome: dto.nome,
      cargaHoraria: dto.cargaHoraria,
      curso,
    });
    return this.repository.save(disciplina);
  }

  async findAll(idCurso: number): Promise<DisciplinaEntity[]> {
    return this.repository.find({
      where: {
        curso: { id: idCurso },
      },
      relations: ['curso', 'turmas', 'prerequisitos'],
    });
  }

  async findOne(id: number): Promise<DisciplinaEntity> {
    const disciplina = await this.repository.findOne({
      where: { id },
      relations: ['curso', 'turmas', 'prerequisitos'],
    });
    if (!disciplina)
      throw new NotFoundException(`Disciplina com ID ${id} não encontrada`);
    return disciplina;
  }

  async update(
    id: number,
    dto: UpdateDisciplinaDto,
  ): Promise<DisciplinaEntity> {
    const disciplina = await this.findOne(id);
    Object.assign(disciplina, dto);
    return this.repository.save(disciplina);
  }

  async remove(id: number): Promise<void> {
    const disciplina = await this.findOne(id);
    await this.repository.remove(disciplina);
  }
}
