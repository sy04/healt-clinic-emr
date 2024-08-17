import { Resolver, Query, Mutation, Args, ObjectType } from '@nestjs/graphql';
import {
  ResponseFormat,
  responseError,
  responseSuccess,
} from 'src/utils/response';
import { HttpStatus } from '@nestjs/common';
import 'reflect-metadata';
import { Appointments } from 'src/schema/appointments.entity';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentPayloadDTO,
  UpdateAppointmentPayloadDTO,
} from './dto/resolver.dto';

@ObjectType()
export class AppointmentResponse extends ResponseFormat(Appointments) {}

@Resolver()
@ObjectType()
export class AppointmentResolver {
  constructor(private readonly appoinmentService: AppointmentService) {}

  @Query(() => AppointmentResponse)
  async getAppointment(@Args('id') id: string): Promise<AppointmentResponse> {
    try {
      const process = await this.appoinmentService.detail(id);

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

  @Mutation(() => AppointmentResponse)
  async createAppointment(
    @Args('input') input: CreateAppointmentPayloadDTO,
  ): Promise<AppointmentResponse> {
    try {
      const process = await this.appoinmentService.create(input);

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

  @Mutation(() => AppointmentResponse)
  async updateAppointment(
    @Args('id') id: string,
    @Args('input') input: UpdateAppointmentPayloadDTO,
  ): Promise<AppointmentResponse> {
    try {
      const process = await this.appoinmentService.update(id, input);

      if (!process) {
        return responseError(
          HttpStatus.INTERNAL_SERVER_ERROR,
          'Internal Server Error',
        );
      } else {
        return responseSuccess(HttpStatus.OK, 'Success', null);
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
