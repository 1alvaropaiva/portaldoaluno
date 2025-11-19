import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'admin' })
export class AdminEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Nome completo do administrador' })
  @Column({ name: 'nome', length: 100 })
  nome: string;

  @ApiProperty({ description: 'E-mail do administrador' })
  @Column({ name: 'email', length: 150, unique: true })
  email: string;

  @ApiProperty({ description: 'Senha de acesso' })
  @Column({ name: 'senha', length: 255, select: false })
  senha: string;

  @ApiProperty({ description: 'Cargo ou função administrativa' })
  @Column({ name: 'cargo', length: 50, default: 'admin' })
  cargo: string;
}
