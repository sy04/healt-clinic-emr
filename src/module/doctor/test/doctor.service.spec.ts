import { Test, TestingModule } from '@nestjs/testing';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Logger } from 'nestjs-pino';
import { getRepositoryToken } from '@nestjs/typeorm';
import { DoctorService } from '../doctor.service';
import { Doctors } from 'src/schema/doctors.entity';
import { IDoctorPayload } from '../doctor.interface';

describe('DoctorService', () => {
  let service: DoctorService;
  let repository: Repository<Doctors>;
  let logger: Logger;

  const mockRepository = {
    save: jest.fn(),
    create: jest.fn(),
    findOneBy: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockLogger = {
    error: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DoctorService,
        { provide: getRepositoryToken(Doctors), useValue: mockRepository },
        { provide: Logger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<DoctorService>(DoctorService);
    repository = module.get<Repository<Doctors>>(getRepositoryToken(Doctors));
    logger = module.get<Logger>(Logger);
  });

  describe('create', () => {
    it('should successfully create a doctor', async () => {
      const dto: IDoctorPayload = { name: 'Doctor Name' };
      const mockDoctor = { id: 'some-id', ...dto };
      mockRepository.create.mockReturnValue(mockDoctor);
      mockRepository.save.mockResolvedValue(mockDoctor);

      const result = await service.create(dto);

      expect(result).toEqual(mockDoctor);
      expect(mockRepository.create).toHaveBeenCalledWith(dto);
      expect(mockRepository.save).toHaveBeenCalledWith(mockDoctor);
    });

    it('should handle errors during creation', async () => {
      const dto: IDoctorPayload = { name: 'Doctor Name' };
      const error = new Error('Error');
      mockRepository.save.mockRejectedValue(error);

      await expect(service.create(dto)).rejects.toThrow(error);
      expect(logger.error).toHaveBeenCalledWith(`[ERROR] = ${error}`);
    });
  });

  describe('update', () => {
    it('should successfully update a doctor', async () => {
      const id = 'some-id';
      const dto: IDoctorPayload = { name: 'Updated Name' };
      const mockDoctor = { id, name: 'Old Name' };
      mockRepository.findOneBy.mockResolvedValue(mockDoctor);
      mockRepository.update.mockResolvedValue({ affected: 1 });

      const result = await service.update(id, dto);

      expect(result).toEqual({ affected: 1 });
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(mockRepository.update).toHaveBeenCalledWith(id, dto);
    });

    it('should throw an error if doctor not found', async () => {
      const id = 'non-existing-id';
      const dto: IDoctorPayload = { name: 'Updated Name' };
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.update(id, dto)).rejects.toThrow(new HttpException('Doctor is not founded.', HttpStatus.NOT_FOUND));
      expect(logger.error).toBeDefined();
    });

    it('should handle errors during update', async () => {
      const id = 'some-id';
      const dto: IDoctorPayload = { name: 'Updated Name' };
      const error = new Error('Error');
      mockRepository.findOneBy.mockResolvedValue({ id });
      mockRepository.update.mockRejectedValue(error);

      await expect(service.update(id, dto)).rejects.toThrow(error);
      expect(logger.error).toBeDefined();
    });
  });

  describe('detail', () => {
    it('should successfully retrieve a doctor', async () => {
      const id = 'some-id';
      const mockDoctor = { id, name: 'Doctor Name' };
      mockRepository.findOneBy.mockResolvedValue(mockDoctor);

      const result = await service.detail(id);

      expect(result).toEqual(mockDoctor);
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
    });

    it('should throw an error if doctor not found', async () => {
      const id = 'non-existing-id';
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.detail(id)).rejects.toThrow(new HttpException('Doctor is not founded.', HttpStatus.NOT_FOUND));
      expect(logger.error).toBeDefined();
    });

    it('should handle errors during retrieval', async () => {
      const id = 'some-id';
      const error = new Error('Error');
      mockRepository.findOneBy.mockRejectedValue(error);

      await expect(service.detail(id)).rejects.toThrow(error);
      expect(logger.error).toBeDefined();
    });
  });

  describe('delete', () => {
    it('should successfully delete a doctor', async () => {
      const id = 'some-id';
      const mockDoctor = { id, name: 'Doctor Name' };
      mockRepository.findOneBy.mockResolvedValue(mockDoctor);
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      const result = await service.delete(id);

      expect(result).toEqual({ affected: 1 });
      expect(mockRepository.findOneBy).toHaveBeenCalledWith({ id });
      expect(mockRepository.delete).toHaveBeenCalledWith(id);
    });

    it('should throw an error if doctor not found', async () => {
      const id = 'non-existing-id';
      mockRepository.findOneBy.mockResolvedValue(null);

      await expect(service.delete(id)).rejects.toThrow(new HttpException('Doctor is not founded.', HttpStatus.NOT_FOUND));
      expect(logger.error).toBeDefined();
    });

    it('should handle errors during deletion', async () => {
      const id = 'some-id';
      const error = new Error('Error');
      mockRepository.findOneBy.mockResolvedValue({ id });
      mockRepository.delete.mockRejectedValue(error);

      await expect(service.delete(id)).rejects.toThrow(error);
      expect(logger.error).toBeDefined();
    });
  });
});
