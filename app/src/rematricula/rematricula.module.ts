import { Module } from '@nestjs/common';
import { CursosModule } from './curso/curso.module';
import { DisciplinasModule } from './disciplina/disciplina.module';
import { TurmasModule } from './turma/turma.module';
import { PreRequisitosModule } from './prerequisito/prerequisito.module';
import { MatriculasModule } from './matricula/matricula.module';
import { AuthModule } from '../auth/auth.module';

@Module({
  imports: [
    AuthModule,
    CursosModule,
    DisciplinasModule,
    TurmasModule,
    PreRequisitosModule,
    MatriculasModule,
  ],
})
export class RematriculaModule {}
