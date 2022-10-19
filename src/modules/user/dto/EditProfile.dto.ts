import {
  IsNotEmpty,
  IsString,
  Length,
  IsOptional,
} from 'class-validator';

export class EditProfileDTO {

  // @IsNotEmpty()
  // @IsString()
  // @Length(1, 255)
  // firstName: string;

  // @IsNotEmpty()
  // lastName: string;

  @IsNotEmpty()
  @IsString()
  @Length(1, 255)
  businessName: string;

  @IsNotEmpty()
  phoneNumber: number;

  @IsNotEmpty()
  stateId: number;

  @IsOptional()
  zipCode: number;

  @IsNotEmpty()
  licenseNumber: string;

  @IsNotEmpty()
  medRecId: number;

  @IsNotEmpty()
  expirationDate: Date;

  @IsOptional()
  profilePath: string;

  @IsOptional()
  licensePath: string;
}
