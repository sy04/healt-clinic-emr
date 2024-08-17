import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { PatientService } from '../patient.service'; // Sesuaikan path jika perlu
import { Patients } from 'src/schema/patients.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockPatient = {
  id: "mock-id",
  firstName: 'John',
  lastName: 'Doe',
  dateOfBirth: '1990-01-01',
  gender: 'MALE',
  contactInfo: {
    id: "mock-id",
    patientId: "mock-id",
    phone: '1234567890',
    email: 'john@example.com'
  },
};

const mockPatientService = {
  detail: jest.fn().mockResolvedValue({ id: 'mock-id' }),
};

const mockRepository = {
  save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
  findOneBy: jest.fn().mockImplementation(({ id }) => {
    if (id === 'mock-id') return mockPatient;
    return null;
  }),
  findOne: jest.fn().mockReturnThis(),
  createQueryBuilder: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getCount: jest.fn().mockResolvedValue(1),
  take: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([mockPatient]),
};

const mockQueryRunner = {
  connect: jest.fn(),
  startTransaction: jest.fn(),
  commitTransaction: jest.fn(),
  rollbackTransaction: jest.fn(),
  release: jest.fn(),
  manager: {
    save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
    create: jest.fn().mockImplementation((entityClass, data) => ({ ...data, id: 'mock-id' })),
    update: jest.fn().mockImplementation((entityClass, data) => ({ ...data, id: 'mock-id' })),
    delete: jest.fn().mockImplementation((entityClass, data) => ({ ...data, id: 'mock-id' })),
    remove: jest.fn().mockImplementation((entityClass, data) => ({ ...data, id: 'mock-id' }))
  },
};

describe('PatientService', () => {
  let service: PatientService;
  let dataSource: DataSource;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PatientService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
        {
          provide: getRepositoryToken(Patients),
          useValue: mockRepository,
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PatientService>(PatientService);
    dataSource = module.get<DataSource>(DataSource);
    logger = module.get<Logger>(Logger);
  });

  describe('createPatient', () => {
    it('should create a patient and return the result', async () => {
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        contactInfo: { phone: '1234567890', email: 'john@example.com' },
      };

      const result = await service.create(input);

      expect(result).toEqual(mockPatient);
      expect(dataSource.createQueryRunner().connect).toHaveBeenCalled();
      expect(dataSource.createQueryRunner().startTransaction).toHaveBeenCalled();
      expect(dataSource.createQueryRunner().commitTransaction).toHaveBeenCalled();
      expect(dataSource.createQueryRunner().release).toHaveBeenCalled();
    });

    it('should throw an error if there is an issue creating the patient', async () => {
      mockQueryRunner.manager.save = jest.fn().mockRejectedValue(new Error('Unexpected error'));
  
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        contactInfo: { phone: '1234567890', email: 'john@example.com' },
      };
  
      await expect(service.create(input)).rejects.toThrowError(
        new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR),
      );
  
      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  
  });

  describe('getPatientDetails', () => {
    it('should return patient details', async () => {
      const id = 'mock-id';
      const result = await service.detail(id);

      expect(result).toEqual(mockPatient);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should throw an error if patient is not found', async () => {
      const id = 'non-existing-id';
      mockRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.detail(id)).rejects.toThrowError(
        new HttpException('Patient is not founded.', HttpStatus.NOT_FOUND),
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(logger.error).toBeDefined();
    });
  });

  describe('updatePatient', () => {
    it('should update patient details', async () => {
      const id = 'mock-id';
      const input = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        contactInfo: { phone: '1234567890', email: 'john@example.com' },
      };

      mockRepository.findOneBy = jest.fn().mockResolvedValue(mockPatient);

      const result = await service.update(id, input);

      expect(result).toBeTruthy();
    });

    it('should throw an error if patient is not found during update', async () => {
      const id = 'non-existing-id';
      mockRepository.findOneBy = jest.fn().mockResolvedValue(null);

      const input = {
        firstName: 'John',
        lastName: 'Doe',
        dateOfBirth: '1990-01-01',
        gender: 'MALE',
        contactInfo: { phone: '1234567890', email: 'john@example.com' },
      };

      await expect(service.update(id, input)).rejects.toThrowError(
        new HttpException('Patient is not founded.', HttpStatus.NOT_FOUND),
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(logger.error).toBeDefined();
    });
  });

  describe('deletePatient', () => {
    it('should delete a patient', async () => {
      const id = 'mock-id';
      mockRepository.findOne = jest.fn().mockResolvedValue(mockPatient);

      await service.delete(id);

      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id },
        relations: ['contactInfo']
      });
      expect(mockQueryRunner.manager.remove).toHaveBeenCalled();
      expect(mockQueryRunner.manager.delete).toHaveBeenCalled();
      expect(mockQueryRunner.startTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.commitTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });

    it('should throw an error if patient is not found during deletion', async () => {
      const id = 'non-existing-id';
      mockRepository.findOne = jest.fn().mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrowError(
        new HttpException('Patient is not founded', HttpStatus.NOT_FOUND),
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });
});
