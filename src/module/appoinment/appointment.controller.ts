import {
  Controller,
  UsePipes,
  ValidationPipe,
  Body,
  Post,
  Res,
  HttpStatus,
  Param,
  Get,
  Put,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { responseError, responseSuccess } from 'src/utils/response';
import { AppointmentService } from './appointment.service';
import {
  CreateAppointmentPayloadDTO,
  UpdateAppointmentPayloadDTO,
} from './dto/index.dto';

@ApiTags('[Doctor]')
@Controller('doctor')
export class AppointmentController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create Appointment' })
  @UsePipes(ValidationPipe)
  async create(@Body() body: CreateAppointmentPayloadDTO, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.appointmentService.create(body);

      if (!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error);
      res.status(statusCode).json(response);
    }
  }

  @Put('/:id')
  @ApiOperation({ summary: 'Update Appointment' })
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() body: UpdateAppointmentPayloadDTO,
    @Res() res,
  ) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.appointmentService.update(id, body);

      if (!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', process);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error);
      res.status(statusCode).json(response);
    }
  }

  @Get('/:id')
  @ApiOperation({ summary: 'Get Appointment Detail' })
  @UsePipes(ValidationPipe)
  async detail(@Param('id') id: string, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.appointmentService.detail(id);

      if (!process) {
        response = responseError(statusCode, 'Internal Server Error');
      } else {
        statusCode = HttpStatus.OK;
        response = responseSuccess(statusCode, 'Success', null);
      }

      res.status(statusCode).json(response);
    } catch (error) {
      response = responseError(statusCode, error);
      res.status(statusCode).json(response);
    }
  }
}
