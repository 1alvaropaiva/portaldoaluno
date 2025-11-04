import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'pessoa' })
export class PessoaEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Nome completo' })
  @Column({ name: 'nome', length: 100 })
  nome: string;

  @ApiProperty({ description: 'E-mail' })
  @Column({ name: 'email', length: 150, unique: true })
  email: string;

  @ApiProperty({ description: 'Senha' })
  @Column({ name: 'senha', length: 255, select: false })
  senha: string;

  @ApiProperty({ description: 'Matrícula' })
  @Column({ name: 'matricula', length: 20, unique: true })
  matricula: string;
}
