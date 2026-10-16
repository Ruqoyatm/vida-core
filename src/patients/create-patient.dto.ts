import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
  Length,
} from 'class-validator';
import { PatientSex } from './patient-sex.enum.js';
import { PayerType } from './payer-type.enum.js';
import { MaritalStatus } from './marital-status.enum.js';

export class CreatePatientDto {
  @IsString()
  @IsNotEmpty()
  surname: string;

  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsOptional()
  otherNames?: string;

  @IsDateString()
  dateOfBirth: string;

  @IsEnum(PatientSex)
  sex: PatientSex;

  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @IsString()
  @Length(7, 20)
  phone: string;

  @IsString()
  @IsOptional()
  address?: string;

  @IsString()
  @IsOptional()
  nextOfKinName?: string;

  @IsString()
  @IsOptional()
  nextOfKinPhone?: string;

  @IsEnum(PayerType)
  @IsOptional()
  payerType?: PayerType;

  @IsString()
  @IsOptional()
  payerScheme?: string;

  @IsString()
  @IsOptional()
  payerRef?: string;

  @IsDateString()
  @IsOptional()
  coverExpiry?: string;
}