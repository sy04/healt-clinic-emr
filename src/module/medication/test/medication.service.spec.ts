import { Test, TestingModule } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { MedicationService } from '../medication.service'; // Sesuaikan path jika perlu
import { Medications } from 'src/schema/medications.entity';
import { MedicalHistories } from 'src/schema/medical_histories.entity';
import { PatientService } from '../../patient/patient.service'; // Sesuaikan path jika perlu
import { IMedicationPayload, IMedicationResponse, IListMedicalHistoryResponse } from '../medication.interface';
import { getRepositoryToken } from '@nestjs/typeorm';
import { HttpException, HttpStatus } from '@nestjs/common';

const mockMedicationResponse: IMedicationResponse = {
  medication: {
    id: 'mock-id',
    patientId: '28402215-9435-4e78-aa3c-c47c41051716',
    name: 'testing',
    dosage: 'testing',
    frequency: 'testing',
  },
  history: {
    id: 'mock-id',
    patientId: '28402215-9435-4e78-aa3c-c47c41051716',
    condition: 'Bagus',
    diagnosisDate: '2024-08-20T00:00:00Z',
    status: 'DONE',
  },
};

const mockPatientService = {
  detail: jest.fn().mockResolvedValue({ id: '28402215-9435-4e78-aa3c-c47c41051716' }),
};

const mockRepository = {
  save: jest.fn().mockImplementation((entity) => Promise.resolve(entity)),
  findOneBy: jest.fn().mockImplementation(({ id }) => {
    if (id === 'mock-id') return mockMedicationResponse.medication;
    return null;
  }),
  createQueryBuilder: jest.fn().mockReturnThis(),
  where: jest.fn().mockReturnThis(),
  andWhere: jest.fn().mockReturnThis(),
  getCount: jest.fn().mockResolvedValue(1),
  take: jest.fn().mockReturnThis(),
  skip: jest.fn().mockReturnThis(),
  getMany: jest.fn().mockResolvedValue([mockMedicationResponse.history]),
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
  },
};

describe('MedicationService', () => {
  let service: MedicationService;
  let dataSource: DataSource;
  let logger: Logger;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationService,
        {
          provide: DataSource,
          useValue: {
            createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
          },
        },
        {
          provide: getRepositoryToken(Medications),
          useValue: mockRepository,
        },
        {
          provide: getRepositoryToken(MedicalHistories),
          useValue: mockRepository,
        },
        {
          provide: Logger,
          useValue: {
            error: jest.fn(),
          },
        },
        {
          provide: PatientService,
          useValue: mockPatientService,
        },
      ],
    }).compile();

    service = module.get<MedicationService>(MedicationService);
    dataSource = module.get<DataSource>(DataSource);
    logger = module.get<Logger>(Logger);
  });

  describe('create', () => {
    it('should create medication and return response', async () => {
      const input: IMedicationPayload = {
        patientId: '28402215-9435-4e78-aa3c-c47c41051716',
        medication: {
          name: 'testing',
          dosage: 'testing',
          frequency: 'testing',
        },
        history: {
          condition: 'Bagus',
          diagnosisDate: '2024-08-20T00:00:00Z',
          status: 'DONE',
        },
      };

      const result = await service.create(input);

      expect(result).toEqual(mockMedicationResponse);
      expect(dataSource.createQueryRunner().connect).toHaveBeenCalled();
      expect(dataSource.createQueryRunner().startTransaction).toHaveBeenCalled();
      expect(dataSource.createQueryRunner().commitTransaction).toHaveBeenCalled();
      expect(dataSource.createQueryRunner().release).toHaveBeenCalled();
    });

    it('should throw HttpException if patient is not found', async () => {
      const input: IMedicationPayload = {
        patientId: 'non-existing-patient-id',
        medication: {
          name: 'testing',
          dosage: 'testing',
          frequency: 'testing',
        },
        history: {
          condition: 'Bagus',
          diagnosisDate: '2024-08-20T00:00:00Z',
          status: 'DONE',
        },
      };

      mockPatientService.detail = jest.fn().mockResolvedValue(null);

      await expect(service.create(input)).rejects.toThrowError(
        new HttpException('Patient is not founded.', HttpStatus.NOT_FOUND),
      );

      expect(mockQueryRunner.rollbackTransaction).toHaveBeenCalled();
      expect(mockQueryRunner.release).toHaveBeenCalled();
    });
  });

  describe('detailMedication', () => {
    it('should return medication details', async () => {
      const id = 'mock-id';
      const result = await service.detailMedication(id);

      expect(result).toBeDefined();
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should throw HttpException if medication is not found', async () => {
      const id = 'non-existing-id';
      mockRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.detailMedication(id)).rejects.toThrowError(
        new HttpException('Medication is not founded.', HttpStatus.NOT_FOUND),
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(logger.error).toBeDefined();
    });
  });

  describe('detailMedicalHistory', () => {
    it('should return medical history details', async () => {
      const id = 'mock-id';
      mockRepository.findOneBy = jest.fn().mockResolvedValue(mockMedicationResponse.history);

      const result = await service.detailMedicalHistory(id);

      expect(result).toEqual(mockMedicationResponse.history);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should throw HttpException if medical history is not found', async () => {
      const id = 'non-existing-id';
      mockRepository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.detailMedicalHistory(id)).rejects.toThrowError(
        new HttpException('Medical History is not founded.', HttpStatus.NOT_FOUND),
      );

      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(logger.error).toBeDefined();
    });
  });

  describe('listMedicalHistory', () => {
    it('should return paginated medical history list for page 1', async () => {
      const params = {
        pagination: true,
        patientId: '28402215-9435-4e78-aa3c-c47c41051716',
        page: 1,
        limit: 10,
        keyword: 'Bag',
      };
  
      const mockHistories = [mockMedicationResponse.history];
      mockRepository.createQueryBuilder().getCount.mockResolvedValue(10);
      mockRepository.createQueryBuilder().getMany.mockResolvedValue(mockHistories);
  
      const result = await service.listMedicalHistory(params);
  
      expect(result).toEqual({
        histories: mockHistories,
        paginator: {
          itemCount: 10,
          limit: 10,
          pageCount: 1,
          page: 1,
          slNo: 1,
          hasPrevPage: false,
          hasNextPage: false,
          prevPage: null,
          nextPage: null,
        },
      });
    });
  
    it('should adjust page if page is greater than pageCount (non-first page)', async () => {
      const params = {
        pagination: true,
        patientId: '28402215-9435-4e78-aa3c-c47c41051716',
        page: 5, // page greater than pageCount
        limit: 10,
        keyword: 'Bag',
      };
  
      const mockHistories = [mockMedicationResponse.history];
      mockRepository.createQueryBuilder().getCount.mockResolvedValue(20); // pageCount will be 2
      mockRepository.createQueryBuilder().getMany.mockResolvedValue(mockHistories);
  
      const result = await service.listMedicalHistory(params);
  
      expect(result.paginator.page).toBe(2); // adjusted to last page
      expect(result.histories).toEqual(mockHistories);
    });

    it('should keep page as 1 if page is greater than pageCount but page == 1', async () => {
      const params = {
        pagination: true,
        patientId: '28402215-9435-4e78-aa3c-c47c41051716',
      };

      const mockHistories = [mockMedicationResponse.history];
      mockRepository.createQueryBuilder().getCount.mockResolvedValue(0); // This will make pageCount 0 or 1
      mockRepository.createQueryBuilder().getMany.mockResolvedValue([]);

      const result = await service.listMedicalHistory(params);

      expect(result.paginator.page).toBe(1); // Should remain 1
      expect(result.histories).toEqual([]); // No histories since count is 0
    });

    it('should set hasNextPage and nextPage correctly when there is a next page', async () => {
      const params = {
        pagination: true,
        patientId: '28402215-9435-4e78-aa3c-c47c41051716',
        page: 1, // Current page
        limit: 10,
        keyword: 'Bag',
      };
  
      const mockHistories = [mockMedicationResponse.history];
  
      // Simulasikan ada lebih dari 10 item, sehingga pageCount > 1
      mockRepository.createQueryBuilder().getCount.mockResolvedValue(20);
      mockRepository.createQueryBuilder().getMany.mockResolvedValue(mockHistories);
  
      const result = await service.listMedicalHistory(params);
  
      expect(result.paginator.hasNextPage).toBe(true); // Karena page < pageCount
      expect(result.paginator.nextPage).toBe(2); // Karena page < pageCount, nextPage harus page + 1
    });

    it('should log an error and throw it when an exception occurs', async () => {
      const params = {
        pagination: true,
        patientId: '28402215-9435-4e78-aa3c-c47c41051716',
        page: 1,
        limit: 10,
        keyword: 'Bag',
      };
  
      mockRepository.createQueryBuilder().getCount.mockRejectedValue(new Error('Unexpected error'));
  
      await expect(service.listMedicalHistory(params)).rejects.toThrow(new Error('Unexpected error'));
      expect(logger.error).toBeDefined();
    });
  });
});
