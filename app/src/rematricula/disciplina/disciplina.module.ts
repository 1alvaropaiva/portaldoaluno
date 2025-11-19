import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DisciplinaEntity } from './entities/disciplina.entity';
import { CursoEntity } from '../curso/entities/curso.entity';
import { DisciplinasController } from './disciplina.controller';
import { DisciplinasService } from './disciplina.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([DisciplinaEntity, CursoEntity]),
    AuthModule,
  ],
  controllers: [DisciplinasController],
  providers: [DisciplinasService],
})
export class DisciplinasModule {}
