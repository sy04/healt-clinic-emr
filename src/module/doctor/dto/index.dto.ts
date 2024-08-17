import { IsNotEmpty, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class DoctorPayloadDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  name: string;
}
