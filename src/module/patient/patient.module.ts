import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Patients } from 'src/schema/patients.entity';
import { ContactInfos } from 'src/schema/contact_infos.entity';
import { PatientController } from './patient.controller';
import { PatientService } from './patient.service';
import { PatientResolver } from './patient.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Patients, ContactInfos])],
  controllers: [PatientController],
  providers: [PatientService, PatientResolver],
})
export class PatientModule {}
