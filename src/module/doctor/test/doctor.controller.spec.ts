import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { responseSuccess, responseError } from 'src/utils/response';
import { DoctorController } from '../doctor.controller';
import { DoctorService } from '../doctor.service';
import { DoctorPayloadDTO } from '../dto/index.dto';

describe('DoctorController', () => {
  let controller: DoctorController;
  let service: DoctorService;

  const mockService = {
    create: jest.fn(),
    detail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DoctorController],
      providers: [
        { provide: DoctorService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<DoctorController>(DoctorController);
    service = module.get<DoctorService>(DoctorService);
  });

  describe('create', () => {
    it('should return success response if service succeeds', async () => {
      const dto = new DoctorPayloadDTO();
      const mockResponse = { id: 'some-id' };
      mockService.create.mockResolvedValue(mockResponse);

      await controller.create(dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const dto = new DoctorPayloadDTO();
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
    });

    it('should return error response if process is null', async () => {
      const dto = new DoctorPayloadDTO();
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
      const mockResponse = { id: 'some-id', name: 'Doctor' };
      mockService.detail.mockResolvedValue(mockResponse);

      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };
      await controller.detail(id, res);

      expect(res.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(res.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', null),
      );
    });

    it('should return error response if service fails', async () => {
      const id = 'some-id';
      mockService.detail.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      await controller.detail(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
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
      const dto = new DoctorPayloadDTO();
      const mockResponse = { id: 'some-id', name: 'Updated Doctor' };
      mockService.update.mockResolvedValue(mockResponse);

      await controller.update(id, dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const id = 'some-id';
      const dto = new DoctorPayloadDTO();
      mockService.update.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      await controller.update(id, dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });

    it('should return error response if process is null', async () => {
      const id = 'some-id';
      const dto = new DoctorPayloadDTO();
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
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });

    it('should return error response if process is null', async () => {
      const id = 'non-existing-id';
      mockService.delete.mockResolvedValue(null);

      await controller.delete(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
  });
});
