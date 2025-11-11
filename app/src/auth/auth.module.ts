import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunosService } from '../alunos/alunos.service';
import { AlunoEntity } from '../alunos/entities/aluno.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlunoEntity]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '3h', algorithm: 'HS256' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, AlunosService],
  exports: [AuthService],
})
export class AuthModule {}
