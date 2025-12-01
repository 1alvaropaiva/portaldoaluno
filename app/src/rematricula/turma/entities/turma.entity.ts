import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { MatriculaAlunoEntity } from '../../matricula/entities/matricula.entity';
import { DisciplinaEntity } from '../../disciplina/entities/disciplina.entity';

@Entity({ name: 'turma' })
export class TurmaEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Professor responsável' })
  @Column({ name: 'professor', length: 100 })
  professor: string;

  @ApiProperty({ description: 'Horário da turma', example: 'Segunda 10h-12h' })
  @Column({ name: 'horario', length: 50 })
  horario: string;

  @ApiProperty({ description: 'Período letivo', example: '1' })
  @Column({ name: 'periodo_letivo' })
  periodoLetivo: number;

  @ManyToOne(() => DisciplinaEntity, (disciplina) => disciplina.turmas, {
    onDelete: 'CASCADE',
  })
  disciplina: DisciplinaEntity;

  @OneToMany(() => MatriculaAlunoEntity, (matricula) => matricula.turma)
  matriculas: MatriculaAlunoEntity[];
}
