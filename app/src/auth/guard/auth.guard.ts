import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { isBlacklisted } from '../token-blacklist';
import { AlunosService } from '../../alunos/alunos.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly alunosService: AlunosService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Nenhum token fornecido');
    }

    if (isBlacklisted(token)) {
      throw new UnauthorizedException(
        'Sessão encerrada. Faça login novamente.',
      );
    }

    try {
      const payload = this.jwtService.verify<{
        nome: string;
        email: string;
        sub: unknown;
      }>(token, { algorithms: ['HS256'] });

      const userId = Number(payload.sub);
      if (!Number.isInteger(userId) || userId <= 0) {
        throw new UnauthorizedException('Token inválido');
      }

      const aluno = await this.alunosService.findOne(userId);
      if (!aluno) {
        throw new UnauthorizedException('Aluno não encontrado');
      }

      request.user = {
        id: aluno.id,
        nome: aluno.nome,
        email: aluno.email,
      };
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('Token inválido', { cause: e });
    }

    return true;
  }
}
