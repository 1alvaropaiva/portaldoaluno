import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MatriculaAlunoEntity } from './entities/matricula.entity';
import { TurmaEntity } from '../turma/entities/turma.entity';
import { AlunoEntity } from '../../alunos/entities/aluno.entity';
import { PreRequisitoEntity } from '../prerequisito/entities/prerequisito.entity';
import { MatriculasController } from './matricula.controller';
import { MatriculasService } from './matricula.service';
import { AlunosModule } from '../../alunos/alunos.module';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MatriculaAlunoEntity,
      TurmaEntity,
      AlunoEntity,
      PreRequisitoEntity,
    ]),
    AlunosModule,
    AuthModule,
  ],
  controllers: [MatriculasController],
  providers: [MatriculasService],
})
export class MatriculasModule {}
