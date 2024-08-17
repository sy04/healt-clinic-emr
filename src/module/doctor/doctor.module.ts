import 'dotenv/config';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Doctors } from 'src/schema/doctors.entity';
import { DoctorController } from './doctor.controller';
import { DoctorService } from './doctor.service';
import { DoctorResolver } from './doctor.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Doctors])],
  controllers: [DoctorController],
  providers: [DoctorService, DoctorResolver],
})
export class DoctorModule {}
