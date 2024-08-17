import { ObjectType, Field } from '@nestjs/graphql';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
  OneToOne,
} from 'typeorm';
import { ContactInfos } from './contact_infos.entity';
import { Appointments } from './appointments.entity';
import { MedicalHistories } from './medical_histories.entity';
import { Medications } from './medications.entity';

@Entity()
@ObjectType()
export class Patients {
  @Field(() => String)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String)
  @Column()
  firstName: string;

  @Field(() => String)
  @Column()
  lastName: string;

  @Field(() => String)
  @Column()
  dateOfBirth: string;

  @Field(() => String)
  @Column()
  gender: string;

  @Field(() => Date)
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;

  @Field(() => Date)
  @Column({
    type: 'timestamp',
    onUpdate: 'CURRENT_TIMESTAMP',
    default: () => 'CURRENT_TIMESTAMP',
  })
  updatedAt: Date;

  @Field(() => ContactInfos, { nullable: true })
  @OneToOne(() => ContactInfos, (contact) => contact.patient, {
    eager: true,
    cascade: true,
  })
  contactInfo?: ContactInfos;

  @Field(() => [Appointments], { nullable: true })
  @OneToMany(() => Appointments, (appointment) => appointment.patient, {
    eager: true,
    cascade: true,
  })
  appointments?: Appointments[];

  @Field(() => [MedicalHistories], { nullable: true })
  @OneToMany(
    () => MedicalHistories,
    (medicalHistory) => medicalHistory.patient,
    { eager: true, cascade: true },
  )
  medicalHistory?: MedicalHistories[];

  @Field(() => [Medications], { nullable: true })
  @OneToMany(() => Medications, (medication) => medication.patient, {
    eager: true,
    cascade: true,
  })
  medications?: Medications[];
}
