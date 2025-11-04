import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { PessoaEntity } from './entities/pessoa.entity';
import { CreatePessoaDto } from './dto/create-pessoa.dto';
import { UpdatePessoaDto } from './dto/update-pessoa.dto';

@Injectable()
export class PessoasService {
  constructor(
    @InjectRepository(PessoaEntity)
    private readonly repository: Repository<PessoaEntity>,
  ) {}

  async create(createPessoaDto: CreatePessoaDto): Promise<PessoaEntity> {
    const senhaHash = await bcrypt.hash(createPessoaDto.senha, 10);
    const pessoa = this.repository.create({
      ...createPessoaDto,
      senha: senhaHash,
    });
    return this.repository.save(pessoa);
  }

  async findAll(): Promise<PessoaEntity[]> {
    return this.repository.find();
  }

  async findOne(id: number): Promise<PessoaEntity> {
    if (!Number.isInteger(id) || id <= 0) {
      throw new BadRequestException('ID inválido');
    }
    const pessoa = await this.repository.findOne({ where: { id } });
    if (!pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }
    return pessoa;
  }

  private async findOneWithPassword(
    id: number,
  ): Promise<PessoaEntity & { senha: string }> {
    const pessoa = await this.repository.findOne({
      where: { id },
      select: ['id', 'nome', 'email', 'matricula', 'senha'],
    });
    if (!pessoa) {
      throw new NotFoundException(`Pessoa com ID ${id} não encontrada`);
    }
    return pessoa;
  }

  async update(
    id: number,
    updatePessoaDto: UpdatePessoaDto,
  ): Promise<PessoaEntity> {
    if ('email' in updatePessoaDto || 'matricula' in updatePessoaDto) {
      throw new BadRequestException(
        'E-mail e matrícula não podem ser alterados',
      );
    }

    const pessoa = await this.findOneWithPassword(id);

    if (updatePessoaDto.nome !== undefined) {
      pessoa.nome = updatePessoaDto.nome;
    }

    if (updatePessoaDto.novaSenha !== undefined) {
      if (!updatePessoaDto.senhaAtual) {
        throw new BadRequestException(
          'Para alterar a senha, informe a senha atual',
        );
      }
      const ok = await bcrypt.compare(updatePessoaDto.senhaAtual, pessoa.senha);
      if (!ok) {
        throw new UnauthorizedException('Senha atual incorreta');
      }
      pessoa.senha = await bcrypt.hash(updatePessoaDto.novaSenha, 10);
    }

    const saved = await this.repository.save(pessoa);
    return saved;
  }

  async remove(id: number): Promise<void> {
    const pessoa = await this.findOne(id);
    await this.repository.remove(pessoa);
  }
}
