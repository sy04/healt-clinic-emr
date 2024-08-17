import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appointments } from 'src/schema/appointments.entity';
import { AppointmentController } from './appointment.controller';
import { AppointmentResolver } from './appointment.resolver';
import { AppointmentService } from './appointment.service';
import { Patients } from 'src/schema/patients.entity';
import { Doctors } from 'src/schema/doctors.entity';
import { PatientService } from '../patient/patient.service';
import { DoctorService } from '../doctor/doctor.service';

@Module({
  imports: [TypeOrmModule.forFeature([Appointments, Patients, Doctors])],
  controllers: [AppointmentController],
  providers: [
    AppointmentService,
    AppointmentResolver,
    PatientService,
    DoctorService,
  ],
})
export class AppointmentModule {}
