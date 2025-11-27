import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CursoEntity } from './entities/curso.entity';
import { CreateCursoDto } from './dto/create-curso.dto';
import { UpdateCursoDto } from './dto/update-curso.dto';

@Injectable()
export class CursosService {
  constructor(
    @InjectRepository(CursoEntity)
    private readonly repository: Repository<CursoEntity>,
  ) {}

  async create(dto: CreateCursoDto): Promise<CursoEntity> {
    const curso = this.repository.create(dto);
    return this.repository.save(curso);
  }

  async findAll(): Promise<CursoEntity[]> {
    return this.repository.find({ relations: ['disciplinas'] });
  }

  async findOne(id: number): Promise<CursoEntity> {
    const curso = await this.repository.findOne({
      where: { id },
      relations: ['disciplinas'],
    });
    if (!curso)
      throw new NotFoundException(`Curso com ID ${id} não encontrado`);
    return curso;
  }

  async update(id: number, dto: UpdateCursoDto): Promise<CursoEntity> {
    const curso = await this.findOne(id);
    Object.assign(curso, dto);
    return this.repository.save(curso);
  }

  async remove(id: number): Promise<void> {
    const curso = await this.findOne(id);

    try {
      await this.repository.remove(curso);
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
      if (error.code === '23503') {
        throw new BadRequestException(
          'Não é possível remover este curso pois existem alunos vinculados a ele.',
        );
      }
      throw error;
    }
  }
}
