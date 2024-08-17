import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { DoctorResolver, DoctorResponse } from '../doctor.resolver';
import { DoctorService } from '../doctor.service';
import { DoctorPayloadDTO } from '../dto/resolver.dto';
import { responseError, responseSuccess } from 'src/utils/response';
import { Doctors } from 'src/schema/doctors.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('DoctorResolver', () => {
  let resolver: DoctorResolver;
  let doctorServiceMock: Partial<DoctorService>;
  let doctorRepository: Repository<Doctors>;

  beforeEach(async () => {
    doctorServiceMock = {
      create: jest.fn(),
      detail: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorResolver,
        {
          provide: DoctorService,
          useValue: doctorServiceMock,
        },
        {
          provide: getRepositoryToken(Doctors),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<DoctorResolver>(DoctorResolver);
    doctorRepository = module.get<Repository<Doctors>>(getRepositoryToken(Doctors));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('getDoctor', () => {
    let doctorId: string;

    beforeEach(() => {
      doctorId = 'test-doctor-id';
    });

    it('should return success response when doctor is found', async () => {
      const result = new Doctors();
      (doctorServiceMock.detail as jest.Mock).mockResolvedValue(result);

      const response = await resolver.getDoctor(doctorId);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (doctorServiceMock.detail as jest.Mock).mockResolvedValue(null);

      const response = await resolver.getDoctor(doctorId);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (doctorServiceMock.detail as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.getDoctor(doctorId);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (doctorServiceMock.detail as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.getDoctor(doctorId);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('createDoctor', () => {
    let createDoctorDTO: DoctorPayloadDTO;

    beforeEach(() => {
      createDoctorDTO = {
        name: 'Test Doctor',
      };
    });

    it('should return success response when doctor is created', async () => {
      const result = new Doctors();
      (doctorServiceMock.create as jest.Mock).mockResolvedValue(result);

      const response = await resolver.createDoctor(createDoctorDTO);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (doctorServiceMock.create as jest.Mock).mockResolvedValue(null);

      const response = await resolver.createDoctor(createDoctorDTO);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (doctorServiceMock.create as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.createDoctor(createDoctorDTO);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (doctorServiceMock.create as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.createDoctor(createDoctorDTO);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('updateDoctor', () => {
    let doctorId: string;
    let updateDoctorDTO: DoctorPayloadDTO;

    beforeEach(() => {
      doctorId = 'test-doctor-id';
      updateDoctorDTO = {
        name: 'Updated Doctor',
      };
    });

    it('should return success response when doctor is updated', async () => {
      const result = new Doctors();
      (doctorServiceMock.update as jest.Mock).mockResolvedValue(result);

      const response = await resolver.updateDoctor(doctorId, updateDoctorDTO);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', null));
    });

    it('should return error response when service returns null', async () => {
      (doctorServiceMock.update as jest.Mock).mockResolvedValue(null);

      const response = await resolver.updateDoctor(doctorId, updateDoctorDTO);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (doctorServiceMock.update as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.updateDoctor(doctorId, updateDoctorDTO);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (doctorServiceMock.update as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.updateDoctor(doctorId, updateDoctorDTO);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('deleteDoctor', () => {
    let doctorId: string;

    beforeEach(() => {
      doctorId = 'test-doctor-id';
    });

    it('should return success response when doctor is deleted', async () => {
      (doctorServiceMock.delete as jest.Mock).mockResolvedValue(true);

      const response = await resolver.deleteDoctor(doctorId);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', null));
    });

    it('should return error response when service returns false', async () => {
      (doctorServiceMock.delete as jest.Mock).mockResolvedValue(false);

      const response = await resolver.deleteDoctor(doctorId);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (doctorServiceMock.delete as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.deleteDoctor(doctorId);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (doctorServiceMock.delete as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.deleteDoctor(doctorId);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });
});
