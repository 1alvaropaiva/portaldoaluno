import {
  Injectable,
  NotFoundException,
  BadRequestException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MatriculaAlunoEntity } from './entities/matricula.entity';
import { CreateMatriculaDto } from './dto/create-matricula.dto';
import { UpdateMatriculaDto } from './dto/update-matricula.dto';
import { TurmaEntity } from '../turma/entities/turma.entity';
import { AlunoEntity } from '../../alunos/entities/aluno.entity';
import { PreRequisitoEntity } from '../prerequisito/entities/prerequisito.entity';
import { DisciplinaEntity } from '../disciplina/entities/disciplina.entity';
import { SituacaoMatricula } from './entities/matricula.entity';

@Injectable()
export class MatriculasService {
  constructor(
    @InjectRepository(MatriculaAlunoEntity)
    private readonly repository: Repository<MatriculaAlunoEntity>,

    @InjectRepository(TurmaEntity)
    private readonly turmaRepository: Repository<TurmaEntity>,

    @InjectRepository(AlunoEntity)
    private readonly alunoRepository: Repository<AlunoEntity>,

    @InjectRepository(PreRequisitoEntity)
    private readonly prereqRepository: Repository<PreRequisitoEntity>,
  ) {}

  async create(
    alunoId: number,
    dto: CreateMatriculaDto,
  ): Promise<MatriculaAlunoEntity> {
    const aluno = await this.alunoRepository.findOne({
      where: { id: alunoId },
    });
    if (!aluno) throw new NotFoundException(`Aluno ${alunoId} não encontrado`);

    const turma = await this.turmaRepository.findOne({
      where: { id: dto.turmaId },
      relations: ['disciplina'],
    });
    if (!turma)
      throw new NotFoundException(`Turma ${dto.turmaId} não encontrada`);

    const jaMatriculado = await this.repository.findOne({
      where: {
        aluno: { id: alunoId },
        turma: { id: dto.turmaId },
      },
    });

    if (jaMatriculado) {
      throw new BadRequestException('Aluno já está matriculado nesta turma');
    }

    const prereqs = await this.prereqRepository.find({
      where: { disciplina: turma.disciplina },
      relations: ['disciplinaRequisito'],
    });

    if (prereqs.length > 0) {
      const matriculasCursadas = await this.repository.find({
        where: { aluno, situacao: SituacaoMatricula.CURSADA },
        relations: ['turma', 'turma.disciplina'],
      });

      const disciplinasCursadas = matriculasCursadas
        .map((m) => m.turma.disciplina?.id)
        .filter((id): id is number => typeof id === 'number');

      for (const prereq of prereqs) {
        if (!disciplinasCursadas.includes(prereq.disciplinaRequisito.id)) {
          throw new BadRequestException(
            `Aluno não possui o pré-requisito: ${prereq.disciplinaRequisito.nome}`,
          );
        }
      }
    }

    const matricula = this.repository.create({
      aluno,
      turma,
      situacao: SituacaoMatricula.CURSANDO,
    });

    return this.repository.save(matricula);
  }

  async findAll(): Promise<MatriculaAlunoEntity[]> {
    return this.repository.find({
      relations: ['aluno', 'turma', 'turma.disciplina'],
    });
  }

  async findOne(id: number, alunoId: number): Promise<MatriculaAlunoEntity> {
    const matricula = await this.repository.findOne({
      where: { id },
      relations: ['aluno', 'turma', 'turma.disciplina'],
    });

    if (!matricula)
      throw new NotFoundException(`Matrícula ${id} não encontrada`);

    if (matricula.aluno.id !== alunoId) {
      throw new UnauthorizedException(
        'Você não tem permissão para acessar esta matrícula',
      );
    }

    return matricula;
  }

  async update(
    id: number,
    alunoId: number,
    dto: UpdateMatriculaDto,
  ): Promise<MatriculaAlunoEntity> {
    const matricula = await this.findOne(id, alunoId);

    Object.assign(matricula, dto);
    return this.repository.save(matricula);
  }

  async remove(id: number, alunoId: number): Promise<void> {
    const matricula = await this.findOne(id, alunoId);

    await this.repository.remove(matricula);
  }

  async listarDisciplinasCursadas(
    alunoId: number,
  ): Promise<DisciplinaEntity[]> {
    const matriculas = await this.repository.find({
      where: { aluno: { id: alunoId }, situacao: SituacaoMatricula.CURSADA },
      relations: ['turma', 'turma.disciplina'],
    });

    const disciplinas = matriculas
      .map((m) => m.turma.disciplina)
      .filter((d): d is DisciplinaEntity => Boolean(d));

    const unique = new Map<number, DisciplinaEntity>();
    disciplinas.forEach((disciplina) => {
      unique.set(disciplina.id, disciplina);
    });

    return Array.from(unique.values());
  }
}
