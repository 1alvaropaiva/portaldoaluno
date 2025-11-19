import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import express from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth.guard';
import { AlunosService } from '../alunos/alunos.service';
import { CreateAlunoDto } from '../alunos/dto/create-aluno.dto';
import { TokenBlacklistService } from './token-blacklist.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly alunosService: AlunosService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  @Post('register')
  async register(@Body() dto: CreateAlunoDto) {
    await this.alunosService.create(dto);
    return { message: 'Cadastrado com sucesso!' };
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @Post('logout')
  async logout(@Req() req: express.Request): Promise<{ message: string }> {
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
      const payload = this.jwtService.verify<{
        exp?: number;
        sub: string | number;
        jti?: string;
      }>(token, {
        algorithms: ['HS256'],
      });

      const userId = payload.sub;
      const jti = payload.jti;

      if (!jti) {
        await this.tokenBlacklistService.addByUserAndJti(userId, 'no-jti');
      } else {
        await this.tokenBlacklistService.addByUserAndJti(userId, jti);
      }
    } catch (err) {
      console.log(err);
    }

    return { message: 'Logout efetuado com sucesso!' };
  }
}
