import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Medications } from 'src/schema/medications.entity';
import { MedicalHistories } from 'src/schema/medical_histories.entity';
import { Patients } from 'src/schema/patients.entity';
import { MedicationController } from './medication.controller';
import { MedicationService } from './medication.service';
import { MedicationResolver } from './medication.resolver';
import { PatientService } from '../patient/patient.service';

@Module({
  imports: [TypeOrmModule.forFeature([Medications, MedicalHistories, Patients])],
  controllers: [MedicationController],
  providers: [MedicationService, MedicationResolver, PatientService],
})
export class MedicationModule {}
