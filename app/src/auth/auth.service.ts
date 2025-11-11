import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { AlunoEntity } from '../alunos/entities/aluno.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AlunoEntity)
    private readonly alunosRepository: Repository<AlunoEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.alunosRepository.findOne({
      where: { email: loginDto.email },
      select: ['id', 'nome', 'email', 'senha'],
    });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const isPasswordValid = bcrypt.compareSync(loginDto.senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const token = this.jwtService.sign({
      nome: user.nome,
      email: user.email,
      sub: user.id,
    });
    return { token };
  }
}
