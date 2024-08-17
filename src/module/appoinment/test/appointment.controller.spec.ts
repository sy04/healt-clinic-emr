import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { responseSuccess, responseError } from 'src/utils/response';
import { AppointmentController } from '../appointment.controller';
import { AppointmentService } from '../appointment.service';
import { CreateAppointmentPayloadDTO, UpdateAppointmentPayloadDTO } from '../dto/index.dto';

describe('AppointmentController', () => {
  let controller: AppointmentController;
  let service: AppointmentService;

  const mockService = {
    create: jest.fn(),
    update: jest.fn(),
    detail: jest.fn(),
  };

  const mockRes = {
    status: jest.fn().mockReturnThis(),
    json: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppointmentController],
      providers: [
        { provide: AppointmentService, useValue: mockService },
      ],
    }).compile();

    controller = module.get<AppointmentController>(AppointmentController);
    service = module.get<AppointmentService>(AppointmentService);
  });

  describe('create', () => {
    it('should return success response if service succeeds', async () => {
      const dto = new CreateAppointmentPayloadDTO();
      const mockResponse = { id: 'some-id' };
      mockService.create.mockResolvedValue(mockResponse);

      await controller.create(dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const dto = new CreateAppointmentPayloadDTO();
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
      const dto = new CreateAppointmentPayloadDTO();
      mockService.create.mockResolvedValue(null);

      await controller.create(dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
  });

  describe('update', () => {
    it('should return success response if service succeeds', async () => {
      const id = 'some-id';
      const dto = new UpdateAppointmentPayloadDTO();
      const mockResponse = { id: 'some-id', status: 'updated' };
      mockService.update.mockResolvedValue(mockResponse);

      await controller.update(id, dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseSuccess(HttpStatus.OK, 'Success', mockResponse),
      );
    });

    it('should return error response if service fails', async () => {
      const id = 'some-id';
      const dto = new UpdateAppointmentPayloadDTO();
      mockService.update.mockRejectedValue(new HttpException('Internal Server Error', HttpStatus.INTERNAL_SERVER_ERROR));

      await controller.update(id, dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });

    it('should return error response if process is null', async () => {
      const id = 'some-id';
      const dto = new UpdateAppointmentPayloadDTO();
      mockService.update.mockResolvedValue(null);

      await controller.update(id, dto, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith(
        responseError(HttpStatus.INTERNAL_SERVER_ERROR, 'Internal Server Error'),
      );
    });
  });

  describe('detail', () => {
    it('should return success response if service succeeds', async () => {
      const id = 'some-id';
      const mockResponse = { id: 'some-id', details: 'Appointment Details' };
      mockService.detail.mockResolvedValue(mockResponse);

      await controller.detail(id, mockRes);

      expect(mockRes.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(mockRes.json).toHaveBeenCalledWith(
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
});
