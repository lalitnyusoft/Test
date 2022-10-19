import {
    IsNotEmpty,
    IsString,
    IsEmail,
    Length,
    MaxLength,
    IsOptional,
} from 'class-validator';

export class UserRegisterDTO {

    @IsNotEmpty()
    role: number

    @IsNotEmpty()
    @IsEmail()
    @Length(1, 255)
    email: string;

    // @IsNotEmpty()
    // @IsString()
    // @Length(1, 255)
    // firstName: string;

    // @IsOptional()
    // lastName: string;

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    businessName: string;

    @IsNotEmpty()
    @IsString()
    password: string;

    @IsNotEmpty()
    @IsString()
    confirmPassword: string;

    @IsNotEmpty()
    selectedState: string;

    @IsNotEmpty()
    zipCode: number;

    @IsNotEmpty()
    @Length(1, 255)
    phoneNumber: number;

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

    @IsOptional()
    planId: string;

    @IsOptional()
    planExpiryDate: Date;

    @IsOptional()
    subscriptionId: number
}
