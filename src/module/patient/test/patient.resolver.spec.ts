import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { PatientResolver, PatientResponse } from '../patient.resolver';
import { PatientService } from '../patient.service';
import { responseError, responseSuccess } from 'src/utils/response';
import { Patients } from 'src/schema/patients.entity';
import { CreatePatientDTO, UpdatePatientDTO } from '../dto/resolver.dto';

describe('PatientResolver', () => {
  let resolver: PatientResolver;
  let patientServiceMock: Partial<PatientService>;

  beforeEach(async () => {
    patientServiceMock = {
      create: jest.fn(),
      detail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientResolver,
        {
          provide: PatientService,
          useValue: patientServiceMock,
        },
      ],
    }).compile();

    resolver = module.get<PatientResolver>(PatientResolver);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('getPatient', () => {
    let patientId: string;

    beforeEach(() => {
      patientId = 'test-patient-id';
    });

    it('should return success response when patient is found', async () => {
      const result = new Patients();
      (patientServiceMock.detail as jest.Mock).mockResolvedValue(result);

      const response = await resolver.getPatient(patientId);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (patientServiceMock.detail as jest.Mock).mockResolvedValue(null);

      const response = await resolver.getPatient(patientId);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (patientServiceMock.detail as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.getPatient(patientId);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (patientServiceMock.detail as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.getPatient(patientId);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('createPatient', () => {
    let createPatientDTO: CreatePatientDTO;

    beforeEach(() => {
      createPatientDTO = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        contactInfo: { phone: '1234567890', email: 'john@example.com' },
      };
    });

    it('should return success response when patient is created', async () => {
      const result = new Patients();
      (patientServiceMock.create as jest.Mock).mockResolvedValue(result);

      const response = await resolver.createPatient(createPatientDTO);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (patientServiceMock.create as jest.Mock).mockResolvedValue(null);

      const response = await resolver.createPatient(createPatientDTO);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (patientServiceMock.create as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.createPatient(createPatientDTO);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (patientServiceMock.create as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.createPatient(createPatientDTO);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('updatePatient', () => {
    let patientId: string;
    let updatePatientDTO: UpdatePatientDTO;

    beforeEach(() => {
      patientId = 'test-patient-id';
      updatePatientDTO = {
        firstName: 'John',
        lastName: 'Doe'
      };
    });

    it('should return success response when patient is updated', async () => {
      (patientServiceMock.update as jest.Mock).mockResolvedValue(true);

      const response = await resolver.updatePatient(patientId, updatePatientDTO);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', null));
    });

    it('should return error response when service returns null', async () => {
      (patientServiceMock.update as jest.Mock).mockResolvedValue(null);

      const response = await resolver.updatePatient(patientId, updatePatientDTO);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (patientServiceMock.update as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.updatePatient(patientId, updatePatientDTO);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (patientServiceMock.update as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.updatePatient(patientId, updatePatientDTO);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('deletePatient', () => {
    let patientId: string;

    beforeEach(() => {
      patientId = 'test-patient-id';
    });

    it('should return success response when patient is deleted', async () => {
      (patientServiceMock.delete as jest.Mock).mockResolvedValue(true);

      const response = await resolver.deletePatient(patientId);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', null));
    });

    it('should return error response when service returns null', async () => {
      (patientServiceMock.delete as jest.Mock).mockResolvedValue(null);

      const response = await resolver.deletePatient(patientId);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (patientServiceMock.delete as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.deletePatient(patientId);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (patientServiceMock.delete as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.deletePatient(patientId);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });
});
