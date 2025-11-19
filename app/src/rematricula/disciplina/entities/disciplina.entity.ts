import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { TurmaEntity } from '../../turma/entities/turma.entity';
import { PreRequisitoEntity } from '../../prerequisito/entities/prerequisito.entity';
import { CursoEntity } from '../../curso/entities/curso.entity';

@Entity({ name: 'disciplina' })
export class DisciplinaEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Código da disciplina' })
  @Column({ name: 'codigo', length: 20, unique: true })
  codigo: string;

  @ApiProperty({ description: 'Nome da disciplina' })
  @Column({ name: 'nome', length: 100 })
  nome: string;

  @ApiProperty({ description: 'Carga horária em horas' })
  @Column({ name: 'carga_horaria' })
  cargaHoraria: number;

  @ManyToOne(() => CursoEntity, (curso) => curso.disciplinas, {
    onDelete: 'CASCADE',
  })
  curso: CursoEntity;

  @OneToMany(() => TurmaEntity, (turma) => turma.disciplina)
  turmas: TurmaEntity[];

  @OneToMany(() => PreRequisitoEntity, (prereq) => prereq.disciplina)
  prerequisitos: PreRequisitoEntity[];
}
