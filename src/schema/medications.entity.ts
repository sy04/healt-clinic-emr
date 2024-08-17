import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Field, ObjectType } from '@nestjs/graphql';
import { Patients } from './patients.entity';

@Entity()
@ObjectType()
export class Medications {
  @Field()
  @PrimaryGeneratedColumn()
  id: string;

  @Field()
  @Column()
  patientId: string;

  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  dosage: string;

  @Field()
  @Column()
  frequency: string;

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
  @ManyToOne(() => Patients, (patient) => patient.medications)
  @JoinColumn({ name: 'patientId' })
  patient: Patients;
}
