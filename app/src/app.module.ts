import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
import { AlunosModule } from './alunos/alunos.module';
import { AlunoEntity } from './alunos/entities/aluno.entity';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST,
      port: Number(process.env.POSTGRES_PORT),
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRES_PASSWORD,
      database: process.env.POSTGRES_DATABASE,
      entities: [AlunoEntity],
      synchronize: process.env.RUN_MIGRATIONS === 'true',
    }),
    AlunosModule,
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
