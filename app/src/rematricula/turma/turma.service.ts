import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { TurmaEntity } from './entities/turma.entity';
import { CreateTurmaDto } from './dto/create-turma.dto';
import { UpdateTurmaDto } from './dto/update-turma.dto';
import { DisciplinaEntity } from '../disciplina/entities/disciplina.entity';

@Injectable()
export class TurmasService {
  constructor(
    @InjectRepository(TurmaEntity)
    private readonly repository: Repository<TurmaEntity>,

    @InjectRepository(DisciplinaEntity)
    private readonly disciplinaRepository: Repository<DisciplinaEntity>,
  ) {}

  async create(dto: CreateTurmaDto): Promise<TurmaEntity> {
    const disciplina = await this.disciplinaRepository.findOne({
      where: { id: dto.disciplinaId },
    });

    if (!disciplina) {
      throw new NotFoundException(
        `Disciplina com ID ${dto.disciplinaId} não encontrada`,
      );
    }

    const turma = this.repository.create({
      professor: dto.professor,
      horario: dto.horario,
      periodoLetivo: dto.periodoLetivo,
      disciplina,
    });

    return this.repository.save(turma);
  }

  async findAll(periodo?: string): Promise<TurmaEntity[]> {
    const where: FindOptionsWhere<TurmaEntity> = {};

    if (periodo) {
      where.periodoLetivo = Number(periodo);
    }

    return this.repository.find({
      where,
      relations: ['disciplina', 'matriculas'],
    });
  }

  async findOne(id: number): Promise<TurmaEntity> {
    const turma = await this.repository.findOne({
      where: { id },
      relations: ['disciplina', 'matriculas'],
    });

    if (!turma) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    }

    return turma;
  }

  async update(id: number, dto: UpdateTurmaDto): Promise<TurmaEntity> {
    const turma = await this.findOne(id);
    if (!turma) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    }
    Object.assign(turma, dto);
    return this.repository.save(turma);
  }

  async remove(id: number): Promise<void> {
    const turma = await this.findOne(id);

    if (!turma) {
      throw new NotFoundException(`Turma com ID ${id} não encontrada`);
    }

    await this.repository.remove(turma);
  }
}
