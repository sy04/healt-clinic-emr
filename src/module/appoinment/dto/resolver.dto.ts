import {
  IsBoolean,
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateAppointmentPayloadDTO {
  @Field()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  patientId: string;

  @Field()
  @IsString()
  @IsUUID()
  @IsNotEmpty()
  doctorId: string;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  date: string;
}

@InputType()
export class UpdateAppointmentPayloadDTO {
  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  date?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  reason?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  notes?: string;

  @Field({ nullable: true })
  @IsBoolean()
  @IsOptional()
  isAble?: boolean;
}
