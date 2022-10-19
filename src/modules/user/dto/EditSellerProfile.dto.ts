import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
  IsNumber,
  Min
} from 'class-validator';

export class EditSellerProfile {

  @IsOptional()
  profilePath: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  // firstName: string;
  businessName: string;

  @IsNotEmpty()
  phoneNumber: number;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  brandName: string;

  @IsOptional()
  website: string;

  @IsNotEmpty()
  year: number;

  @IsOptional()
  avgOrder:string;

  @IsNotEmpty()
  licenseNumber: string;

  @IsNotEmpty()
  medRecId: number;

  @IsNotEmpty()
  expirationDate: Date;

  @IsOptional()
  licensePath: string;

  @IsNotEmpty()
  stateId: number;

  @IsOptional()
  zipCode: number;

  @IsNotEmpty()
  @IsString()
  address: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}
