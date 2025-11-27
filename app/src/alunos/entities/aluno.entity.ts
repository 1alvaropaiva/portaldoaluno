import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { CursoEntity } from '../../rematricula/curso/entities/curso.entity';
import { MatriculaAlunoEntity } from '../../rematricula/matricula/entities/matricula.entity';

@Entity({ name: 'aluno' })
export class AlunoEntity {
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

  @ApiProperty({ description: 'Curso do aluno' })
  @ManyToOne(() => CursoEntity, (curso) => curso.alunos, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  curso: CursoEntity;

  @OneToMany(() => MatriculaAlunoEntity, (matricula) => matricula.aluno)
  matriculas: MatriculaAlunoEntity[];
}
