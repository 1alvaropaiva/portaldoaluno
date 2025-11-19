import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { TokenBlacklistService } from '../token-blacklist.service';
import { AuthService } from '../auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly jwtService: JwtService,
    private readonly authService: AuthService,
    private readonly tokenBlacklistService: TokenBlacklistService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      throw new UnauthorizedException('Nenhum token fornecido');
    }

    try {
      const payload = this.jwtService.verify<{
        sub: number;
        role: 'aluno' | 'admin';
        jti: string;
      }>(token);

      const userId = Number(payload.sub);
      const role = payload.role;
      const jti = payload.jti;

      if (
        await this.tokenBlacklistService.isBlacklistedByUserAndJti(
          userId,
          jti,
        )
      ) {
        throw new UnauthorizedException('Sessão encerrada');
      }

      const user = await this.authService.findUserByIdAndRole(userId, role);

      if (!user) {
        throw new UnauthorizedException('Usuário não encontrado');
      }

      request.user = {
        id: user.id,
        nome: user.nome,
        email: user.email,
        role,
        jti: payload.jti,
      };
    } catch (err) {
      console.error(err);
      throw new UnauthorizedException('Token inválido');
    }

    return true;
  }
}
