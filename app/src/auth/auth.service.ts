import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { AlunoEntity } from '../alunos/entities/aluno.entity';
import { randomUUID } from 'crypto';
import { SessionService } from './session.service';
import { JwtPayload } from '../@types/express';
import { AdminEntity } from '../admin/entities/admin.entity';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(AlunoEntity)
    private readonly alunosRepository: Repository<AlunoEntity>,
    @InjectRepository(AdminEntity)
    private readonly adminRepository: Repository<AdminEntity>,
    private readonly jwtService: JwtService,
    private readonly sessionService: SessionService,
  ) {}

  async login(loginDto: LoginDto) {
    const role: 'aluno' | 'admin' = loginDto.tipo;
    const user =
      loginDto.tipo === 'aluno'
        ? await this.alunosRepository.findOne({
            where: { email: loginDto.email },
            select: ['id', 'nome', 'email', 'senha'],
          })
        : await this.adminRepository.findOne({
            where: { email: loginDto.email },
            select: ['id', 'nome', 'email', 'senha', 'cargo'],
          });

    if (!user) {
      throw new UnauthorizedException('Credenciais inválidas');
    }
    const isPasswordValid = bcrypt.compareSync(loginDto.senha, user.senha);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciais inválidas');
    }

    const jti = randomUUID();

    const payload = {
      nome: user.nome,
      email: user.email,
      sub: user.id,
      role,
      jti,
    };
    const token = this.jwtService.sign(payload);

    const decoded = this.jwtService.verify<JwtPayload>(token);
    const now = Math.floor(Date.now() / 1000);
    const expiresInSeconds = decoded?.exp
      ? Math.max(1, decoded.exp - now)
      : 3 * 3600;

    await this.sessionService.storeToken(user.id, jti, expiresInSeconds);

    return { token };
  }
  async findUserByIdAndRole(id: number, role: 'aluno' | 'admin') {
    if (role === 'aluno') {
      return this.alunosRepository.findOne({ where: { id } });
    }
    return this.adminRepository.findOne({ where: { id } });
  }
}
