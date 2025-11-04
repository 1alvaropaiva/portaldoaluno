import { Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { PessoaEntity } from '../pessoas/entities/pessoa.entity';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(PessoaEntity)
    private readonly pessoasRepository: Repository<PessoaEntity>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.pessoasRepository.findOne({
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
