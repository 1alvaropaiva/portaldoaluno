import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PessoaEntity } from '../pessoas/entities/pessoa.entity';
import { PessoasService } from '../pessoas/pessoas.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PessoaEntity]),
    JwtModule.register({
      global: true,
      secret: 'secret',
      signOptions: { expiresIn: '3h', algorithm: 'HS256' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, PessoasService],
  exports: [AuthService],
})
export class AuthModule {}
