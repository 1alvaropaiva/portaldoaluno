import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import * as dotenv from 'dotenv';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AlunosModule } from './alunos/alunos.module';
import { RedisModule } from './redis/redis.module';
import { AlunoEntity } from './alunos/entities/aluno.entity';
import { TurmaEntity } from './rematricula/turma/entities/turma.entity';
import { CursoEntity } from './rematricula/curso/entities/curso.entity';
import { DisciplinaEntity } from './rematricula/disciplina/entities/disciplina.entity';
import { PreRequisitoEntity } from './rematricula/prerequisito/entities/prerequisito.entity';
import { MatriculaAlunoEntity } from './rematricula/matricula/entities/matricula.entity';
import { RematriculaModule } from './rematricula/rematricula.module';
import { AdminModule } from './admin/admin.module';

dotenv.config();

@Module({
  imports: [
    RedisModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [
        AlunoEntity,
        CursoEntity,
        DisciplinaEntity,
        TurmaEntity,
        PreRequisitoEntity,
        MatriculaAlunoEntity,
      ],
      synchronize: process.env.RUN_MIGRATIONS === 'true',
    }),
    AlunosModule,
    RematriculaModule,
    AuthModule,
    MailModule,
    AdminModule,
  ],
})
export class AppModule {}
