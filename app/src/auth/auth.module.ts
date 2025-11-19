import { forwardRef, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoEntity } from '../alunos/entities/aluno.entity';
import { TokenBlacklistService } from './token-blacklist.service';
import { AuthController } from './auth.controller';
import { SessionService } from './session.service';
import { RedisModule } from '../redis/redis.module';
import { AuthGuard } from './guard/auth.guard';
import { AdminEntity } from '../admin/entities/admin.entity';
import { AlunosModule } from '../alunos/alunos.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlunoEntity, AdminEntity]),
    RedisModule,
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'secret',
      signOptions: { expiresIn: '3h' },
    }),
    forwardRef(() => AlunosModule),
  ],
  controllers: [AuthController],
  providers: [AuthService, SessionService, TokenBlacklistService, AuthGuard],
  exports: [AuthService, TokenBlacklistService, SessionService, AuthGuard],
})
export class AuthModule {}
