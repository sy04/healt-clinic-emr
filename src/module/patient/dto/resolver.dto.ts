import { InputType, Field } from '@nestjs/graphql';
import {
  IsDateString,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsObject,
  IsOptional,
  IsString,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { GenderEnum } from '../patient.enum';

@InputType()
class ContactInfoInput {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  @IsEmail({}, { message: 'Email format is wrong' })
  email?: string;

  @Field({ nullable: true })
  @IsString()
  @MaxLength(17, {
    message: 'Phone number must be filled in with a maximum of 17 numbers',
  })
  @MinLength(8, {
    message: 'Phone number must be filled in with a minimum of 8 numbers',
  })
  @IsOptional()
  phone?: string;
}

@InputType()
export class CreatePatientDTO {
  @Field()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @Field()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @Field()
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @Field()
  @IsEnum(GenderEnum)
  @IsString()
  @IsNotEmpty()
  gender: string;

  @Field(() => ContactInfoInput)
  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoInput)
  @IsNotEmpty()
  contactInfo: ContactInfoInput;
}

@InputType()
export class UpdatePatientDTO {
  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  firstName?: string;

  @Field({ nullable: true })
  @IsString()
  @IsOptional()
  lastName?: string;

  @Field({ nullable: true })
  @IsDateString()
  @IsOptional()
  dateOfBirth?: string;

  @Field({ nullable: true })
  @IsEnum(GenderEnum)
  @IsString()
  @IsOptional()
  gender?: string;

  @Field(() => ContactInfoInput, { nullable: true })
  @IsObject()
  @ValidateNested()
  @Type(() => ContactInfoInput)
  @IsOptional()
  contactInfo?: ContactInfoInput;
}
