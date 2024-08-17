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
  Delete,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { responseError, responseSuccess } from 'src/utils/response';
import { DoctorService } from './doctor.service';
import { DoctorPayloadDTO } from './dto/index.dto';

@ApiTags('[Doctor]')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  @Post('/')
  @ApiOperation({ summary: 'Create Doctor' })
  @UsePipes(ValidationPipe)
  async create(@Body() body: DoctorPayloadDTO, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.doctorService.create(body);

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
  @ApiOperation({ summary: 'Get Doctor Detail' })
  @UsePipes(ValidationPipe)
  async detail(@Param('id') id: string, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.doctorService.detail(id);

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

  @Put('/:id')
  @ApiOperation({ summary: 'Update Doctor' })
  @UsePipes(ValidationPipe)
  async update(
    @Param('id') id: string,
    @Body() body: DoctorPayloadDTO,
    @Res() res,
  ) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.doctorService.update(id, body);

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

  @Delete('/:id')
  @ApiOperation({ summary: 'Update Doctor' })
  @UsePipes(ValidationPipe)
  async delete(@Param('id') id: string, @Res() res) {
    let response = {},
      statusCode = 500;
    try {
      const process = await this.doctorService.delete(id);

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
