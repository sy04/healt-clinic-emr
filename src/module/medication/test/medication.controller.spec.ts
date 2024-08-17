import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from 'nestjs-pino';
import { HttpException, HttpStatus } from '@nestjs/common';
import { responseSuccess, responseError } from 'src/utils/response';
import { CreateMedicationDTO, ParamsMedicalHistoryDTO } from '../dto/index.dto';
import { MedicationController } from '../medication.controller';
import { MedicationService } from '../medication.service';

describe('MedicationController', () => {
  let controller: MedicationController;
  let service: MedicationService;
  let logger: Logger;

  const mockService = {
    create: jest.fn(),
    listMedicalHistory: jest.fn(),
    detailMedication: jest.fn(),
    detailMedicalHistory: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn().mockReturnThis(),
  };
  

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MedicationController],
      providers: [
        { provide: MedicationService, useValue: mockService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<MedicationController>(MedicationController);
    service = module.get<MedicationService>(MedicationService);
    logger = module.get<Logger>(Logger);
  });

  describe('create', () => {
    it('should return success response if service succeeds', async () => {
      const dto = new CreateMedicationDTO();
      const mockResponse = { id: 'some-id' };
      mockService.create.mockResolvedValue(mockResponse);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await controller.create(dto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const dto = new CreateMedicationDTO();
      mockService.create.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await controller.create(dto, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: expect.any(HttpException),
          }),
          data: null,
        }),
      );
      expect(logger.error).toBeDefined();
    });

    it('should return error response if process is null', async () => {
      const body = new CreateMedicationDTO();
      mockService.create = jest.fn().mockResolvedValue(null);

      await controller.create(body, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
  });

  describe('listMedicalHistory', () => {
    it('should return success response if service succeeds', async () => {
      const params = new ParamsMedicalHistoryDTO();
      const mockResponse = { histories: [], paginator: {} };
      mockService.listMedicalHistory.mockResolvedValue(mockResponse);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await controller.listMedicalHistory(params, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const params = new ParamsMedicalHistoryDTO();
      mockService.listMedicalHistory.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await controller.listMedicalHistory(params, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: expect.any(HttpException),
          }),
          data: null,
        }),
      );
      expect(logger.error).toBeDefined();
    });

    it('should return error response if process is null', async () => {
      const params = new ParamsMedicalHistoryDTO();
      mockService.listMedicalHistory = jest.fn().mockResolvedValue(null);
    
      await controller.listMedicalHistory(params, mockRes);
    
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
    
  });

  describe('detailMedication', () => {
    it('should return success response if service succeeds', async () => {
      const id = 'some-id';
      const mockResponse = { id: 'some-id', name: 'Medication' };
      mockService.detailMedication.mockResolvedValue(mockResponse);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await controller.detailMedication(id, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const id = 'some-id';
      mockService.detailMedication.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await controller.detailMedication(id, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: expect.any(HttpException),
          }),
          data: null,
        }),
      );
      expect(logger.error).toBeDefined();
    });

    it('should return error response if process is null', async () => {
      const id = 'non-existing-id';
      mockService.detailMedication = jest.fn().mockResolvedValue(null);
    
      await controller.detailMedication(id, mockRes);
    
      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
    
  });

  describe('detailMedicalHistory', () => {
    it('should return success response if service succeeds', async () => {
      const id = 'some-id';
      const mockResponse = { id: 'some-id', history: 'Medical history details' };
      mockService.detailMedicalHistory.mockResolvedValue(mockResponse);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await controller.detailMedicalHistory(id, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const id = 'some-id';
      mockService.detailMedicalHistory.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await controller.detailMedicalHistory(id, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          meta: expect.objectContaining({
            code: HttpStatus.INTERNAL_SERVER_ERROR,
            success: false,
            message: expect.any(HttpException),
          }),
          data: null,
        }),
      );
      expect(logger.error).toBeDefined();
    });

    it('should return error response if process is null', async () => {
      const id = 'non-existing-id';
      mockService.detailMedicalHistory = jest.fn().mockResolvedValue(null);

      await controller.detailMedicalHistory(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
    
  });
});
