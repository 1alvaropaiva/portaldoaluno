import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PreRequisitoEntity } from './entities/prerequisito.entity';
import { PreRequisitosController } from './prerequisito.controller';
import { DisciplinaEntity } from '../disciplina/entities/disciplina.entity';
import { PreRequisitosService } from './prerequisito.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([PreRequisitoEntity, DisciplinaEntity]),
    AuthModule,
  ],
  controllers: [PreRequisitosController],
  providers: [PreRequisitosService],
})
export class PreRequisitosModule {}
