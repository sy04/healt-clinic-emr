import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GenderEnum } from '../patient.enum';

class ContactInfo {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Email format is wrong' })
  email: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  phone: string;
}

export class CreatePatientDTO {
  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @Type(() => String)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @Type(() => String)
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty()
  @Type(() => String)
  @IsEnum(GenderEnum)
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @Type(() => ContactInfo)
  @IsOptional()
  @IsObject()
  @ValidateNested({ each: true })
  contactInfo: ContactInfo;
}

export class UpdatePatientDTO {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  firstName: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsString()
  @IsOptional()
  lastName: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsDateString()
  @IsOptional()
  dateOfBirth: string;

  @ApiPropertyOptional()
  @Type(() => String)
  @IsEnum(GenderEnum)
  @IsOptional()
  @IsNotEmpty()
  gender: string;

  @ApiPropertyOptional()
  @Type(() => ContactInfo)
  @IsOptional()
  @IsOptional()
  @ValidateNested({ each: true })
  contactInfo: ContactInfo;
}
