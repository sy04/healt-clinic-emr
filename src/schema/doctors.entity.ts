import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import { Appointments } from './appointments.entity';
import { Field, ObjectType } from '@nestjs/graphql';

@Entity()
@ObjectType()
export class Doctors {
  @Field()
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column()
  name: string;

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

  @Field(() => Appointments)
  @OneToOne(() => Appointments, (appointment) => appointment.doctor, {
    eager: true,
  })
  appointment: Appointments;
}
