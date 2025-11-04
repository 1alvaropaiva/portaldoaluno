import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { PessoasService } from '../../pessoas/pessoas.service';
import { isBlacklisted } from '../token-blacklist';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly pessoasService: PessoasService,
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

      const pessoa = await this.pessoasService.findOne(userId);
      if (!pessoa) {
        throw new UnauthorizedException('Pessoa não encontrada');
      }

      request.user = {
        id: pessoa.id,
        nome: pessoa.nome,
        email: pessoa.email,
      };
    } catch (e) {
      console.error(e);
      throw new UnauthorizedException('Token inválido', { cause: e });
    }

    return true;
  }
}
