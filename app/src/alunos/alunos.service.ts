import {
    BadRequestException, ForbiddenException,
    Injectable,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { AlunoEntity } from './entities/aluno.entity';
import { CreateAlunoDto } from './dto/create-aluno.dto';
import { UpdateAlunoDto } from './dto/update-aluno.dto';
import { CursoEntity } from '../rematricula/curso/entities/curso.entity';
import {JwtPayload} from "../@types/express";
import {AdminUpdateAlunoDto} from "./dto/admin-update-aluno.dto";

@Injectable()
export class AlunosService {
  constructor(
    @InjectRepository(AlunoEntity)
    private readonly repository: Repository<AlunoEntity>,
    @InjectRepository(CursoEntity)
    private readonly cursoRepository: Repository<CursoEntity>,
  ) {}

  async create(createAlunoDto: CreateAlunoDto): Promise<AlunoEntity> {
    const { cursoId, senha, ...rest } = createAlunoDto;
    const curso = await this.cursoRepository.findOne({
      where: { id: cursoId },
    });
    if (!curso) {
      throw new BadRequestException(`Curso com ID ${cursoId} não encontrado`);
    }
    const senhaHash = await bcrypt.hash(senha, 10);
    const aluno = this.repository.create({
      ...rest,
      curso,
      senha: senhaHash,
    });
    return this.repository.save(aluno);
  }
  async findAll(): Promise<AlunoEntity[]> {
    return this.repository.find();
  }
  async findOne(id: number, user: JwtPayload | undefined): Promise<AlunoEntity> {
      if (!user) {
          throw new ForbiddenException('Aluno não autenticado');
      }
      if (!Number.isInteger(id) || id <= 0) {
          throw new BadRequestException('ID inválido');
      }
      const aluno = await this.repository.findOne({ where: { id } });
      if (!aluno) {
          throw new NotFoundException(`Aluno com ID ${id} não encontrado`);
      }
      if (user.role === 'aluno' && user.id !== id) {
          throw new ForbiddenException('Você não tem permissão para acessar este aluno');
      }
      return aluno;
  }
  private async findOneWithPassword(
    id: number,
  ): Promise<AlunoEntity & { senha: string }> {
    const aluno = await this.repository.findOne({
      where: { id },
      select: ['id', 'nome', 'email', 'matricula', 'senha'],
    });
    if (!aluno) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrada`);
    }
    return aluno;
  }

  async update(
    id: number,
    updateAlunoDto: UpdateAlunoDto,
  ): Promise<AlunoEntity> {
    if ('email' in updateAlunoDto || 'matricula' in updateAlunoDto) {
      throw new BadRequestException(
        'E-mail e matrícula não podem ser alterados',
      );
    }
    const aluno = await this.findOneWithPassword(id);
    if (updateAlunoDto.nome !== undefined) {
      aluno.nome = updateAlunoDto.nome;
    }
    if (updateAlunoDto.novaSenha !== undefined) {
      if (!updateAlunoDto.senhaAtual) {
        throw new BadRequestException(
          'Para alterar a senha, informe a senha atual',
        );
      }
      const ok = await bcrypt.compare(updateAlunoDto.senhaAtual, aluno.senha);
      if (!ok) {
        throw new UnauthorizedException('Senha atual incorreta');
      }
      aluno.senha = await bcrypt.hash(updateAlunoDto.novaSenha, 10);
    }
    return await this.repository.save(aluno);
  }

  async adminUpdate(
      id: number,
      dto: AdminUpdateAlunoDto,
  ): Promise<AlunoEntity> {
      const aluno = await this.findOneWithPassword(id);
      if (!aluno) {
          throw new NotFoundException('Aluno não encontrado');
      }
      if (dto.nome !== undefined) aluno.nome = dto.nome;
      if (dto.email !== undefined) aluno.email = dto.email;
      if (dto.matricula !== undefined) aluno.matricula = dto.matricula;
      if (dto.novaSenha !== undefined) {
          aluno.senha = await bcrypt.hash(dto.novaSenha, 10);
      }
      return await this.repository.save(aluno);
  }

  async remove(id: number, user: JwtPayload): Promise<void> {
    const aluno = await this.findOne(id, user);
      if (!aluno) {
          throw new NotFoundException('Aluno não encontrado');
      }
      if (user.role === 'aluno' && user.id !== id) {
          throw new ForbiddenException('Você não tem permissão para deletar outro aluno');
      }
    await this.repository.remove(aluno);
  }
}
