import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TurmaEntity } from './entities/turma.entity';
import { DisciplinaEntity } from '../disciplina/entities/disciplina.entity';
import { TurmasController } from './turma.controller';
import { TurmasService } from './turma.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TurmaEntity, DisciplinaEntity]),
    AuthModule,
  ],
  controllers: [TurmasController],
  providers: [TurmasService],
})
export class TurmasModule {}
