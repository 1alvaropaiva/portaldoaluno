import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { AuthService } from './auth.service';
import express from 'express';
import { JwtService } from '@nestjs/jwt';
import { AuthGuard } from './guard/auth.guard';
import { AlunosService } from '../alunos/alunos.service';
import { CreateAlunoDto } from '../alunos/dto/create-aluno.dto';
import { TokenBlacklistService } from './token-blacklist.service';
import {ApiBearerAuth, ApiOperation, ApiResponse} from '@nestjs/swagger';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly alunosService: AlunosService,
    private readonly jwtService: JwtService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  @Post('register')
  @ApiOperation({
    summary: 'Registra um novo aluno no sistema',
  })
  @ApiResponse({
    status: 200,
    description: 'Cadastrado com sucesso!',
  })
  @ApiResponse({
    status: 400,
    description: 'Curso com ID *id* não encontrado',
  })
  async register(@Body() dto: CreateAlunoDto) {
    await this.alunosService.create(dto);
    return { message: 'Aluno cadastrado com sucesso!' };
  }

  @Post('login')
  @ApiOperation({
    summary: 'Realiza o login do aluno/admin no sistema',
  })
  @ApiResponse({
    status: 200,
    description: '*Token JWT do login*',
  })
  @ApiResponse({
    status: 401,
    description: 'Credenciais inválidas',
  })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @UseGuards(AuthGuard)
  @ApiBearerAuth('Token JWT')
  @Post('logout')
  @ApiOperation({
    summary: 'Realiza o logout do aluno/admin no sistema',
  })
  @ApiResponse({
    status: 201,
    description: 'Logout efetuado com sucesso!',
  })
  @ApiResponse({
    status: 401,
    description: 'Nenhum token fornecido',
  })
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
