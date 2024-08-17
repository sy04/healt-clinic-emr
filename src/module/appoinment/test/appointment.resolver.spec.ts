import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { AppointmentResolver } from '../appointment.resolver';
import { AppointmentService } from '../appointment.service';
import { CreateAppointmentPayloadDTO, UpdateAppointmentPayloadDTO } from '../dto/resolver.dto';
import { responseError, responseSuccess } from 'src/utils/response';
import { Appointments } from 'src/schema/appointments.entity';

describe('AppointmentResolver', () => {
  let resolver: AppointmentResolver;
  let appointmentServiceMock: Partial<AppointmentService>;

  beforeEach(async () => {
    appointmentServiceMock = {
      create: jest.fn(),
      detail: jest.fn(),
      update: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AppointmentResolver,
        {
          provide: AppointmentService,
          useValue: appointmentServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<AppointmentResolver>(AppointmentResolver);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAppointment', () => {
    let appointmentId: string;

    beforeEach(() => {
      appointmentId = 'test-appointment-id';
    });

    it('should return success response when appointment is found', async () => {
      const result = new Appointments();
      (appointmentServiceMock.detail as jest.Mock).mockResolvedValue(result);

      const response = await resolver.getAppointment(appointmentId);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (appointmentServiceMock.detail as jest.Mock).mockResolvedValue(null);

      const response = await resolver.getAppointment(appointmentId);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (appointmentServiceMock.detail as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.getAppointment(appointmentId);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (appointmentServiceMock.detail as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.getAppointment(appointmentId);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('createAppointment', () => {
    let createAppointmentDTO: CreateAppointmentPayloadDTO;

    beforeEach(() => {
      createAppointmentDTO = {
        patientId: 'patient-id',
        doctorId: 'doctor-id',
        date: '2024-08-17T00:00:00Z',
      };
    });

    it('should return success response when appointment is created', async () => {
      const result = new Appointments();
      (appointmentServiceMock.create as jest.Mock).mockResolvedValue(result);

      const response = await resolver.createAppointment(createAppointmentDTO);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (appointmentServiceMock.create as jest.Mock).mockResolvedValue(null);

      const response = await resolver.createAppointment(createAppointmentDTO);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (appointmentServiceMock.create as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.createAppointment(createAppointmentDTO);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (appointmentServiceMock.create as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.createAppointment(createAppointmentDTO);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('updateAppointment', () => {
    let appointmentId: string;
    let updateAppointmentDTO: UpdateAppointmentPayloadDTO;

    beforeEach(() => {
      appointmentId = 'test-appointment-id';
      updateAppointmentDTO = {
        date: '2024-08-18T00:00:00Z',
        reason: 'Updated reason',
        notes: 'Updated notes',
        isAble: true,
      };
    });

    it('should return success response when appointment is updated', async () => {
      (appointmentServiceMock.update as jest.Mock).mockReturnThis();

      const response = await resolver.updateAppointment(appointmentId, updateAppointmentDTO);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', null));
    });

    it('should return error response when service returns null', async () => {
      (appointmentServiceMock.update as jest.Mock).mockResolvedValue(null);

      const response = await resolver.updateAppointment(appointmentId, updateAppointmentDTO);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (appointmentServiceMock.update as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.updateAppointment(appointmentId, updateAppointmentDTO);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (appointmentServiceMock.update as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.updateAppointment(appointmentId, updateAppointmentDTO);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });
});
