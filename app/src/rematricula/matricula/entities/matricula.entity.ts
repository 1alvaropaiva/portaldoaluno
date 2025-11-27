import { ApiProperty } from '@nestjs/swagger';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, Unique } from 'typeorm';
import { AlunoEntity } from '../../../alunos/entities/aluno.entity';
import { TurmaEntity } from '../../turma/entities/turma.entity';

export enum SituacaoMatricula {
  ATIVA = 'ativa',
  CANCELADA = 'cancelada',
}

@Entity({ name: 'matricula_aluno' })
@Unique(['aluno', 'turma'])
export class MatriculaAlunoEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ManyToOne(() => AlunoEntity, (aluno) => aluno.matriculas, {
    onDelete: 'CASCADE',
  })
  aluno: AlunoEntity;

  @ManyToOne(() => TurmaEntity, (turma) => turma.matriculas, {
    onDelete: 'CASCADE',
  })
  turma: TurmaEntity;

  @ApiProperty({ description: 'Situação da matrícula', example: SituacaoMatricula.ATIVA })
  @Column({
    name: 'situacao',
    type: 'enum',
    enum: SituacaoMatricula,
    default: SituacaoMatricula.ATIVA,
  })
  situacao: SituacaoMatricula;

  @ApiProperty({ description: 'Data da matrícula' })
  @Column({
    name: 'data_matricula',
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP',
  })
  dataMatricula: Date;
}
