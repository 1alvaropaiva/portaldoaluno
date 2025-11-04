import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoasService } from './pessoas.service';
import { PessoasController } from './pessoas.controller';
import { PessoaEntity } from './entities/pessoa.entity';
import { AuthGuard } from '../auth/guard/auth.guard';

@Module({
  imports: [TypeOrmModule.forFeature([PessoaEntity])],
  controllers: [PessoasController],
  providers: [PessoasService, AuthGuard],
})
export class PessoasModule {}
