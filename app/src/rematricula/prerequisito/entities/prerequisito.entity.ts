import { ApiProperty } from '@nestjs/swagger';
import { Entity, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { DisciplinaEntity } from '../../disciplina/entities/disciplina.entity';

@Entity({ name: 'prerequisito' })
export class PreRequisitoEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn({ name: 'id' })
  id: number;

  @ApiProperty({ description: 'Disciplina que exige o pré-requisito' })
  @ManyToOne(() => DisciplinaEntity, (disciplina) => disciplina.prerequisitos, {
    onDelete: 'CASCADE',
  })
  disciplina: DisciplinaEntity;

  @ApiProperty({ description: 'Disciplina que é o pré-requisito' })
  @ManyToOne(() => DisciplinaEntity, { onDelete: 'CASCADE' })
  disciplinaRequisito: DisciplinaEntity;
}
