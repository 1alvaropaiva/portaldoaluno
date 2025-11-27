import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AlunoEntity } from './entities/aluno.entity';
import { AlunosService } from './alunos.service';
import { AlunosController } from './alunos.controller';
import { AuthModule } from '../auth/auth.module';
import { CursoEntity } from '../rematricula/curso/entities/curso.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([AlunoEntity, CursoEntity]),
    forwardRef(() => AuthModule),
  ],
  controllers: [AlunosController],
  providers: [AlunosService],
  exports: [AlunosService],
})
export class AlunosModule {}
