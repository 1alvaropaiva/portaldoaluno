import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PreRequisitoEntity } from './entities/prerequisito.entity';
import { CreatePreRequisitoDto } from './dto/create-prerequisito.dto';
import { UpdatePreRequisitoDto } from './dto/update-prerequisito.dto';
import { DisciplinaEntity } from '../disciplina/entities/disciplina.entity';

@Injectable()
export class PreRequisitosService {
  constructor(
    @InjectRepository(PreRequisitoEntity)
    private readonly repository: Repository<PreRequisitoEntity>,
    @InjectRepository(DisciplinaEntity)
    private readonly disciplinaRepository: Repository<DisciplinaEntity>,
  ) {}

  async create(dto: CreatePreRequisitoDto): Promise<PreRequisitoEntity> {
    const disciplina = await this.disciplinaRepository.findOne({
      where: { id: dto.disciplinaId },
    });
    const requisito = await this.disciplinaRepository.findOne({
      where: { id: dto.disciplinaRequisitoId },
    });

    if (!disciplina)
      throw new NotFoundException(
        `Disciplina ${dto.disciplinaId} não encontrada`,
      );
    if (!requisito)
      throw new NotFoundException(
        `Disciplina requisito ${dto.disciplinaRequisitoId} não encontrada`,
      );

    const prereq = this.repository.create({
      disciplina,
      disciplinaRequisito: requisito,
    });
    return this.repository.save(prereq);
  }

  async findAll(): Promise<PreRequisitoEntity[]> {
    return this.repository.find({
      relations: ['disciplina', 'disciplinaRequisito'],
    });
  }

  async findOne(id: number): Promise<PreRequisitoEntity> {
    const prereq = await this.repository.findOne({
      where: { id },
      relations: ['disciplina', 'disciplinaRequisito'],
    });
    if (!prereq)
      throw new NotFoundException(`Pré-requisito com ID ${id} não encontrado`);
    return prereq;
  }

  async update(
    id: number,
    dto: UpdatePreRequisitoDto,
  ): Promise<PreRequisitoEntity> {
    const prereq = await this.findOne(id);

    if (dto.disciplinaId) {
      const disciplina = await this.disciplinaRepository.findOne({
        where: { id: dto.disciplinaId },
      });
      if (!disciplina)
        throw new NotFoundException(
          `Disciplina ${dto.disciplinaId} não encontrada`,
        );
      prereq.disciplina = disciplina;
    }

    if (dto.disciplinaRequisitoId) {
      const requisito = await this.disciplinaRepository.findOne({
        where: { id: dto.disciplinaRequisitoId },
      });
      if (!requisito)
        throw new NotFoundException(
          `Disciplina requisito ${dto.disciplinaRequisitoId} não encontrada`,
        );
      prereq.disciplinaRequisito = requisito;
    }

    return this.repository.save(prereq);
  }

  async remove(id: number): Promise<void> {
    const prereq = await this.findOne(id);
    await this.repository.remove(prereq);
  }
}
