import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoEntity } from './entities/aluno.entity';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlunoEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AlunosController],
  providers: [AlunosService],
  exports: [AlunosService],
})
export class AlunosModule {}
