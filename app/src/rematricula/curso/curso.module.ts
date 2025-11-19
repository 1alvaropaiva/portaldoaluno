import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CursoEntity } from './entities/curso.entity';
import { CursosController } from './curso.controller';
import { CursosService } from './curso.service';
import { AuthModule } from '../../auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([CursoEntity]), AuthModule],
  controllers: [CursosController],
  providers: [CursosService],
})
export class CursosModule {}
