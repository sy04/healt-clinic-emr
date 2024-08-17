import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Patients } from './patients.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class MedicalHistories {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  patientId: string;

  @Field()
  @Column()
  condition: string;

  @Field()
  @Column()
  diagnosisDate: string;

  @Field()
  @Column()
  status: string;

  @Field()
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field()
  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Field(() => Patients)
  @ManyToOne(() => Patients, (patient) => patient.medicalHistory)
  @JoinColumn({ name: 'patientId' })
  patient: Patients;
}
