import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { Appointments } from 'src/schema/appointments.entity';
import {
  ICreateAppointmentPayload,
  IUpdateAppointmentPayload,
} from './appointment.interface';
import { PatientService } from '../patient/patient.service';
import { DoctorService } from '../doctor/doctor.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(Appointments)
    private appointmentRepository: Repository<Appointments>,
    private readonly logger: Logger,
    private readonly patientService: PatientService,
    private readonly doctorService: DoctorService,
  ) {}

  async create(input: ICreateAppointmentPayload): Promise<Appointments> {
    try {
      const patient = await this.patientService.detail(input.patientId);
      if (!patient)
        throw new HttpException(
          'Patient is not founded.',
          HttpStatus.NOT_FOUND,
        );

      const doctor = await this.doctorService.detail(input.doctorId);
      if (!doctor)
        throw new HttpException('Doctor is not founded.', HttpStatus.NOT_FOUND);

      return await this.appointmentRepository.save(
        await this.appointmentRepository.create(input),
      );
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }

  async update(id: string, input: IUpdateAppointmentPayload) {
    try {
      const appointment = await this.appointmentRepository.findOneBy({ id });
      if (!appointment)
        throw new HttpException(
          'Appointment is not founded.',
          HttpStatus.NOT_FOUND,
        );

      return await this.appointmentRepository.update(id, input);
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }

  async detail(id: string): Promise<Appointments> {
    try {
      const appointment = await this.appointmentRepository
        .createQueryBuilder('appointment')
        .leftJoinAndSelect('appointment.patient', 'patient')
        .leftJoinAndSelect('appointment.doctor', 'doctor')
        .where('appointment.id = :id', { id })
        .getOne();

      if (!appointment)
        throw new HttpException(
          'Appointment is not founded.',
          HttpStatus.NOT_FOUND,
        );

      return appointment;
    } catch (error) {
      await this.logger.error(`[ERROR] = ${error}`);
      throw error;
    }
  }
}
