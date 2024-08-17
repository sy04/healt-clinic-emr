import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { MedicationResolver, MedicationResponseFormat } from '../medication.resolver';
import { MedicationService } from '../medication.service';
import { CreateMedicationDTO, ParamsMedicalHistoryDTO } from '../dto/resolver.dto';
import { responseError, responseSuccess } from 'src/utils/response';
import { Medications } from 'src/schema/medications.entity';
import { MedicalHistories } from 'src/schema/medical_histories.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('MedicationResolver', () => {
  let resolver: MedicationResolver;
  let medicationServiceMock: Partial<MedicationService>;
  let medicationRepository: Repository<Medications>;
  let medicalHistoryRepository: Repository<MedicalHistories>;

  beforeEach(async () => {
    medicationServiceMock = {
      create: jest.fn(),
      detailMedication: jest.fn(),
      detailMedicalHistory: jest.fn(),
      listMedicalHistory: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MedicationResolver,
        {
          provide: MedicationService,
          useValue: medicationServiceMock,
        },
        {
          provide: getRepositoryToken(Medications),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(MedicalHistories),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<MedicationResolver>(MedicationResolver);
    medicationRepository = module.get<Repository<Medications>>(getRepositoryToken(Medications));
    medicalHistoryRepository = module.get<Repository<MedicalHistories>>(getRepositoryToken(MedicalHistories));
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  describe('createMedication', () => {
    let createMedicationDTO: CreateMedicationDTO;

    beforeEach(() => {
      createMedicationDTO = {
        patientId: 'test-patient-id',
        medication: {
          name: 'Test Medication',
          dosage: '10mg',
          frequency: 'Daily',
        },
        history: {
          condition: 'Test Condition',
          diagnosisDate: '2023-08-01',
          status: 'ACTIVE',
        },
      };
    });

    it('should return success response when medication is created', async () => {
      const result = new MedicationResponseFormat();
      (medicationServiceMock.create as jest.Mock).mockResolvedValue(result);

      const response = await resolver.createMedication(createMedicationDTO);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (medicationServiceMock.create as jest.Mock).mockResolvedValue(null);

      const response = await resolver.createMedication(createMedicationDTO);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (medicationServiceMock.create as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.createMedication(createMedicationDTO);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without 500', async () => {
      (medicationServiceMock.create as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.createMedication(createMedicationDTO);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('getMedication', () => {
    let medicationId: string;

    beforeEach(() => {
      medicationId = 'test-medication-id';
    });

    it('should return success response when medication is found', async () => {
      const result = new Medications();
      (medicationServiceMock.detailMedication as jest.Mock).mockResolvedValue(result);

      const response = await resolver.getMedication(medicationId);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (medicationServiceMock.detailMedication as jest.Mock).mockResolvedValue(null);

      const response = await resolver.getMedication(medicationId);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (medicationServiceMock.detailMedication as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.getMedication(medicationId);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (medicationServiceMock.detailMedication as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.getMedication(medicationId);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('getMedicalHistory', () => {
    let historyId: string;

    beforeEach(() => {
      historyId = 'test-history-id';
    });

    it('should return success response when medical history is found', async () => {
      const result = new MedicalHistories();
      (medicationServiceMock.detailMedicalHistory as jest.Mock).mockResolvedValue(result);

      const response = await resolver.getMedicalHistory(historyId);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (medicationServiceMock.detailMedicalHistory as jest.Mock).mockResolvedValue(null);

      const response = await resolver.getMedicalHistory(historyId);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (medicationServiceMock.detailMedicalHistory as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.getMedicalHistory(historyId);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (medicationServiceMock.detailMedicalHistory as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.getMedicalHistory(historyId);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });

  describe('listMedicalHistory', () => {
    let params: ParamsMedicalHistoryDTO;

    beforeEach(() => {
      params = {
        pagination: true,
        patientId: 'test-patient-id',
        page: 1,
        limit: 10,
      };
    });

    it('should return success response when medical histories are found', async () => {
      const result = { histories: [], paginator: {} };
      (medicationServiceMock.listMedicalHistory as jest.Mock).mockResolvedValue(result);

      const response = await resolver.listMedicalHistory(params);
      expect(response).toEqual(responseSuccess(HttpStatus.OK, 'Success', result));
    });

    it('should return error response when service returns null', async () => {
      (medicationServiceMock.listMedicalHistory as jest.Mock).mockResolvedValue(null);

      const response = await resolver.listMedicalHistory(params);
      expect(response).toEqual(responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'));
    });

    it('should return error response on exception', async () => {
      (medicationServiceMock.listMedicalHistory as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.INTERNAL_SERVER_ERROR));

      const response = await resolver.listMedicalHistory(params);
      expect(response.meta.message.toString()).toContain('Unexpected error');
      expect(response.meta.code).toBe(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(response.meta.success).toBe(false);
    });

    it('should return error response on exception without status 500', async () => {
      (medicationServiceMock.listMedicalHistory as jest.Mock).mockRejectedValue(new HttpException('Unexpected error', HttpStatus.BAD_REQUEST));

      const response = await resolver.listMedicalHistory(params);
      expect(response).toEqual(responseError(HttpStatus.BAD_REQUEST, 'Unexpected error'));
    });
  });
});
