import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import express from 'express';
import { addToBlacklist } from './token-blacklist';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth.guard';
import { AlunosService } from '../alunos/alunos.service';
import { CreateAlunoDto } from '../alunos/dto/create-aluno.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly alunosService: AlunosService,
    private readonly jwtService: JwtService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateAlunoDto) {
    await this.alunosService.create(dto);
    return { message: 'Cadastrado com sucesso!' };
  }

  @Post('login')
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  logout(@Req() req: express.Request): { message: string } {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
      return { message: 'Token não fornecido' };
    }

    const parts = authHeader.split(' ');
    const token = parts.length === 2 ? parts[1] : undefined;

    if (!token) {
      return { message: 'Formato de token inválido' };
    }

    try {
      const payload = this.jwtService.verify<{ exp: number }>(token, {
        algorithms: ['HS256'],
      });
      addToBlacklist(token, payload.exp);
    } catch {
      addToBlacklist(token);
    }

    return { message: 'Logout efetuado com sucesso!' };
  }
}
