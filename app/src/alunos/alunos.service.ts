import {
  BadRequestException,
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

@Injectable()
export class AlunosService {
  constructor(
    @InjectRepository(AlunoEntity)
    private readonly repository: Repository<AlunoEntity>,
  ) {}

  async create(createAlunoDto: CreateAlunoDto): Promise<AlunoEntity> {
    const senhaHash = await bcrypt.hash(createAlunoDto.senha, 10);
    const aluno = this.repository.create({
      ...createAlunoDto,
      senha: senhaHash,
    });
    return this.repository.save(aluno);
  }

  async findAll(): Promise<AlunoEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<AlunoEntity> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }
    const aluno = await this.repository.findOne({ where: { id } });
    if (!aluno) {
      throw new NotFoundException(`Aluno com ID ${id} não encontrada`);
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

    const saved = await this.repository.save(aluno);
    return saved;
  }

  async remove(id: number): Promise<void> {
    const aluno = await this.findOne(id);
    await this.repository.remove(aluno);
  }
}
