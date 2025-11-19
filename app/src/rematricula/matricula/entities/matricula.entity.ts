import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { AlunoEntity } from '../../../alunos/entities/aluno.entity';
import { TurmaEntity } from '../../turma/entities/turma.entity';

@Entity({ name: 'matricula_aluno' })
export class MatriculaAlunoEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => AlunoEntity, (aluno) => aluno.id, { onDelete: 'CASCADE' })
  aluno: AlunoEntity;

  @ManyToOne(() => TurmaEntity, (turma) => turma.matriculas, {
    onDelete: 'CASCADE',
  })
  turma: TurmaEntity;

  @ApiProperty({ description: 'Situação da matrícula', example: 'ativa' })
  @Column({ name: 'situacao', default: 'ativa' })
  situacao: string;

  @ApiProperty({ description: 'Data da matrícula' })
  @Column({
    name: 'data_matricula',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataMatricula: Date;
}
