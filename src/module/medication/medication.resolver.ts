import { Resolver, Query, Mutation, Args, ObjectType } from '@nestjs/graphql';
import {
  ResponseFormat,
  responseError,
  responseSuccess,
} from 'src/utils/response';
import { HttpStatus } from '@nestjs/common';
import 'reflect-metadata';
import { Medications } from 'src/schema/medications.entity';
import { MedicalHistories } from 'src/schema/medical_histories.entity';
import { MedicationService } from './medication.service';
import { CreateMedicationDTO, ListMedicalHistoryResponseDTO, MedicationResponseDTO, ParamsMedicalHistoryDTO } from './dto/resolver.dto';

@ObjectType()
export class MedicationResponse extends ResponseFormat(Medications) {}

@ObjectType()
export class MedicalHistoryResponse extends ResponseFormat(MedicalHistories) {}

@ObjectType()
export class MedicationResponseFormat extends ResponseFormat(MedicationResponseDTO) {}

@ObjectType()
export class ListMedicationResponseFormat extends ResponseFormat(ListMedicalHistoryResponseDTO) {}

@Resolver()
@ObjectType()
export class MedicationResolver {
  constructor(private readonly medicationService: MedicationService) {}

  @Mutation(() => MedicationResponseFormat)
  async createMedication(
    @Args('input') input: CreateMedicationDTO,
  ): Promise<MedicationResponseFormat> {
    try {
      const process = await this.medicationService.create(input);

      if (!process) {
        return responseError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      } else {
        return responseSuccess(HttpStatus.OK, 'Success', process);
      }
    } catch (error) {
      if (error.getStatus() === 500) {
        return responseError(HttpStatus.INTERNAL_SERVER_ERROR, error);
      } else {
        return responseError(error.getStatus(), error.getResponse());
      }
    }
  }

  @Query(() => MedicationResponse)
  async getMedication(@Args('id') id: string): Promise<MedicationResponse> {
    try {
      const process = await this.medicationService.detailMedication(id);

      if (!process) {
        return responseError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      } else {
        return responseSuccess(HttpStatus.OK, 'Success', process);
      }
    } catch (error) {
      if (error.getStatus() === 500) {
        return responseError(HttpStatus.INTERNAL_SERVER_ERROR, error);
      } else {
        return responseError(error.getStatus(), error.getResponse());
      }
    }
  }

  @Query(() => MedicalHistoryResponse)
  async getMedicalHistory(@Args('id') id: string): Promise<MedicalHistoryResponse> {
    try {
      const process = await this.medicationService.detailMedicalHistory(id);

      if (!process) {
        return responseError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      } else {
        return responseSuccess(HttpStatus.OK, 'Success', process);
      }
    } catch (error) {
      if (error.getStatus() === 500) {
        return responseError(HttpStatus.INTERNAL_SERVER_ERROR, error);
      } else {
        return responseError(error.getStatus(), error.getResponse());
      }
    }
  }

  @Query(() => ListMedicationResponseFormat)
  async listMedicalHistory(@Args('params') params: ParamsMedicalHistoryDTO): Promise<ListMedicationResponseFormat> {
    try {
      const process = await this.medicationService.listMedicalHistory(params);

      if (!process) {
        return responseError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      } else {
        return responseSuccess(HttpStatus.OK, 'Success', process);
      }
    } catch (error) {
      if (error.getStatus() === 500) {
        return responseError(HttpStatus.INTERNAL_SERVER_ERROR, error);
      } else {
        return responseError(error.getStatus(), error.getResponse());
      }
    }
  }
}
