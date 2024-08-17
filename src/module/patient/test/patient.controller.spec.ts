import { Test, TestingModule } from '@nestjs/testing';
import { Logger } from 'nestjs-pino';
import { HttpException, HttpStatus } from '@nestjs/common';
import { responseSuccess, responseError } from 'src/utils/response';
import { PatientController } from '../patient.controller';
import { PatientService } from '../patient.service';
import { CreatePatientDTO, UpdatePatientDTO } from '../dto/index.dto';

describe('PatientController', () => {
  let controller: PatientController;
  let service: PatientService;
  let logger: Logger;

  const mockService = {
    create: jest.fn(),
    detail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
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
      controllers: [PatientController],
      providers: [
        { provide: PatientService, useValue: mockService },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<PatientController>(PatientController);
    service = module.get<PatientService>(PatientService);
    logger = module.get<Logger>(Logger);
  });

  describe('create', () => {
    it('should return success response if service succeeds', async () => {
      const dto = new CreatePatientDTO();
      const mockResponse = { id: 'some-id' };
      mockService.create.mockResolvedValue(mockResponse);

      await controller.create(dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const dto = new CreatePatientDTO();
      mockService.create.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      await controller.create(dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
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
      const dto = new CreatePatientDTO();
      mockService.create.mockResolvedValue(null);

      await controller.create(dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
  });

  describe('detail', () => {
    it('should return success response if service succeeds', async () => {
      const id = 'some-id';
      const mockResponse = { id: 'some-id', name: 'Patient' };
      mockService.detail.mockResolvedValue(mockResponse);

      await controller.detail(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const id = 'some-id';
      mockService.detail.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      await controller.detail(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
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
      mockService.detail.mockResolvedValue(null);

      await controller.detail(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
  });

  describe('update', () => {
    it('should return success response if service succeeds', async () => {
      const id = 'some-id';
      const dto = new UpdatePatientDTO();
      const mockResponse = { id: 'some-id' };
      mockService.update.mockResolvedValue(mockResponse);

      await controller.update(id, dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', null),
      );
    });

    it('should return error response if service fails', async () => {
      const id = 'some-id';
      const dto = new UpdatePatientDTO();
      mockService.update.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      await controller.update(id, dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
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
      const id = 'some-id';
      const dto = new UpdatePatientDTO();
      mockService.update.mockResolvedValue(null);

      await controller.update(id, dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
  });

  describe('delete', () => {
    it('should return success response if service succeeds', async () => {
      const id = 'some-id';
      mockService.delete.mockResolvedValue(true);

      await controller.delete(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', null),
      );
    });

    it('should return error response if service fails', async () => {
      const id = 'some-id';
      mockService.delete.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      await controller.delete(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
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
      mockService.delete.mockResolvedValue(false);

      await controller.delete(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
  });
});
