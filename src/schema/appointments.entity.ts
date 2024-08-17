import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { Patients } from './patients.entity';
import { Doctors } from './doctors.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Appointments {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  patientId: string;

  @Field()
  @Column()
  doctorId: string;

  @Field()
  @Column()
  date: string;

  @Field({ nullable: true })
  @Column()
  reason?: string;

  @Field({ nullable: true })
  @Column()
  notes?: string;

  @Field()
  @Column()
  isAble: boolean;

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
  @ManyToOne(() => Patients, (patient) => patient.appointments)
  @JoinColumn({ name: 'patientId' })
  patient: Patients;

  @Field(() => Doctors)
  @OneToOne(() => Doctors, (doctor) => doctor.appointment)
  @JoinColumn({ name: 'doctorId' })
  doctor: Doctors;
}
