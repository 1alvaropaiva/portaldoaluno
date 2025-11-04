import * as dotenv from 'dotenv';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaEntity } from './pessoas/entities/pessoa.entity';
import { PessoasModule } from './pessoas/pessoas.module';
import { AuthModule } from './auth/auth.module';
import { MailModule } from './mail/mail.module';
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
      entities: [PessoaEntity],
      synchronize: process.env.RUN_MIGRATIONS === 'false',
    }),
    PessoasModule,
    AuthModule,
    MailModule,
  ],
})
export class AppModule {}
