import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { Patients } from './patients.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class ContactInfos {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  patientId: string;

  @Field()
  @Column()
  email: string;

  @Field()
  @Column()
  phone: string;

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
  @OneToOne(() => Patients, (patient) => patient.contactInfo, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'patientId' })
  patient: Patients;
}
