import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { DisciplinaEntity } from '../../disciplina/entities/disciplina.entity';

@Entity({ name: 'curso' })
export class CursoEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Nome do curso' })
  @Column({ name: 'nome', length: 100 })
  nome: string;

  @ApiProperty({ description: 'Sigla do curso' })
  @Column({ name: 'sigla', length: 10, unique: true })
  sigla: string;

  @OneToMany(() => DisciplinaEntity, (disciplina) => disciplina.curso)
  disciplinas: DisciplinaEntity[];
}
