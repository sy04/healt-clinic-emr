import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { getRepositoryToken } from '@nestjs/typeorm';
import { AppointmentService } from '../appointment.service';
import { Appointments } from 'src/schema/appointments.entity';
import { ICreateAppointmentPayload, IUpdateAppointmentPayload } from '../appointment.interface';
import { PatientService } from 'src/module/patient/patient.service';
import { DoctorService } from 'src/module/doctor/doctor.service';

describe('AppointmentService', () => {
  let service: AppointmentService;
  let appointmentRepository: Repository<Appointments>;
  let logger: Logger;
  let patientService: PatientService;
  let doctorService: DoctorService;

  const mockAppointmentRepository = {
    save: jest.fn(),
    create: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    createQueryBuilder: jest.fn().mockReturnThis(),
    leftJoinAndSelect: jest.fn().mockReturnThis(),
    where: jest.fn().mockReturnThis(),
    getOne: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  const mockPatientService = {
    detail: jest.fn(),
  };

  const mockDoctorService = {
    detail: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentService,
        { provide: getRepositoryToken(Appointments), useValue: mockAppointmentRepository },
        { provide: Logger, useValue: mockLogger },
        { provide: PatientService, useValue: mockPatientService },
        { provide: DoctorService, useValue: mockDoctorService },
      ],
    }).compile();

    service = module.get<AppointmentService>(AppointmentService);
    appointmentRepository = module.get<Repository<Appointments>>(getRepositoryToken(Appointments));
    logger = module.get<Logger>(Logger);
    patientService = module.get<PatientService>(PatientService);
    doctorService = module.get<DoctorService>(DoctorService);
  });

  describe('create', () => {
    it('should successfully create an appointment', async () => {
      const dto: ICreateAppointmentPayload = { patientId: 'patient-id', doctorId: 'doctor-id', date: '2024-08-08' };
      const mockPatient = { id: 'patient-id' };
      const mockDoctor = { id: 'doctor-id' };
      const mockAppointment = { id: 'some-id', ...dto };

      mockPatientService.detail.mockResolvedValue(mockPatient);
      mockDoctorService.detail.mockResolvedValue(mockDoctor);
      mockAppointmentRepository.create.mockReturnValue(mockAppointment);
      mockAppointmentRepository.save.mockResolvedValue(mockAppointment);

      const result = await service.create(dto);

      expect(result).toEqual(mockAppointment);
      expect(mockPatientService.detail).toHaveBeenCalledWith(dto.patientId);
      expect(mockDoctorService.detail).toHaveBeenCalledWith(dto.doctorId);
      expect(mockAppointmentRepository.create).toHaveBeenCalledWith(dto);
      expect(mockAppointmentRepository.save).toHaveBeenCalledWith(mockAppointment);
    });

    it('should throw error if patient not found', async () => {
      const dto: ICreateAppointmentPayload = { patientId: 'patient-id', doctorId: 'doctor-id', date: '2024-08-08' };
      mockPatientService.detail.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(new HttpException('Patient is not founded.', HttpStatus.NOT_FOUND));
      expect(logger.error).toHaveBeenCalled();
    });

    it('should throw error if doctor not found', async () => {
      const dto: ICreateAppointmentPayload = { patientId: 'patient-id', doctorId: 'doctor-id', date: '2024-08-08' };
      const mockPatient = { id: 'patient-id' };
      mockPatientService.detail.mockResolvedValue(mockPatient);
      mockDoctorService.detail.mockResolvedValue(null);

      await expect(service.create(dto)).rejects.toThrow(new HttpException('Doctor is not founded.', HttpStatus.NOT_FOUND));
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle errors during creation', async () => {
      const dto: ICreateAppointmentPayload = { patientId: 'patient-id', doctorId: 'doctor-id', date: '2024-08-08' };
      const error = new Error('Error');
      mockPatientService.detail.mockResolvedValue({ id: 'patient-id' });
      mockDoctorService.detail.mockResolvedValue({ id: 'doctor-id' });
      mockAppointmentRepository.save.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(`[ERROR] = ${error}`);
    });
  });

  describe('update', () => {
    it('should successfully update an appointment', async () => {
      const id = 'some-id';
      const dto: IUpdateAppointmentPayload = { date: '2024-08-08' };
      const mockAppointment = { id };

      mockAppointmentRepository.findOneBy.mockResolvedValue(mockAppointment);
      mockAppointmentRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(id, dto);

      expect(result).toEqual({ affected: 1 });
      expect(mockAppointmentRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(mockAppointmentRepository.update).toHaveBeenCalledWith(id, dto);
    });

    it('should throw error if appointment not found', async () => {
      const id = 'non-existing-id';
      const dto: IUpdateAppointmentPayload = { date: '2024-08-08' };
      mockAppointmentRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(id, dto)).rejects.toThrow(new HttpException('Appointment is not founded.', HttpStatus.NOT_FOUND));
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle errors during update', async () => {
      const id = 'some-id';
      const dto: IUpdateAppointmentPayload = { date: '2024-08-08' };
      const error = new Error('Error');
      mockAppointmentRepository.findOneBy.mockResolvedValue({ id });
      mockAppointmentRepository.update.mockRejectedValue(error);

      await expect(service.update(id, dto)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(`[ERROR] = ${error}`);
    });
  });

  describe('detail', () => {
    it('should successfully retrieve an appointment', async () => {
      const id = 'some-id';
      const mockAppointment = { id, patient: {}, doctor: {} };
      mockAppointmentRepository.createQueryBuilder.mockReturnThis();
      mockAppointmentRepository.leftJoinAndSelect.mockReturnThis();
      mockAppointmentRepository.where.mockReturnThis();
      mockAppointmentRepository.getOne.mockResolvedValue(mockAppointment);

      const result = await service.detail(id);

      expect(result).toEqual(mockAppointment);
      expect(mockAppointmentRepository.createQueryBuilder).toHaveBeenCalledWith('appointment');
      expect(mockAppointmentRepository.leftJoinAndSelect).toHaveBeenCalledWith('appointment.patient', 'patient');
      expect(mockAppointmentRepository.leftJoinAndSelect).toHaveBeenCalledWith('appointment.doctor', 'doctor');
      expect(mockAppointmentRepository.where).toHaveBeenCalledWith('appointment.id = :id', { id });
      expect(mockAppointmentRepository.getOne).toHaveBeenCalled();
    });

    it('should throw error if appointment not found', async () => {
      const id = 'non-existing-id';
      mockAppointmentRepository.createQueryBuilder.mockReturnThis();
      mockAppointmentRepository.leftJoinAndSelect.mockReturnThis();
      mockAppointmentRepository.where.mockReturnThis();
      mockAppointmentRepository.getOne.mockResolvedValue(null);

      await expect(service.detail(id)).rejects.toThrow(new HttpException('Appointment is not founded.', HttpStatus.NOT_FOUND));
      expect(logger.error).toHaveBeenCalled();
    });

    it('should handle errors during retrieval', async () => {
      const id = 'some-id';
      const error = new Error('Error');
      mockAppointmentRepository.createQueryBuilder.mockReturnThis();
      mockAppointmentRepository.leftJoinAndSelect.mockReturnThis();
      mockAppointmentRepository.where.mockReturnThis();
      mockAppointmentRepository.getOne.mockRejectedValue(error);

      await expect(service.detail(id)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(`[ERROR] = ${error}`);
    });
  });
});
