import {
    IsNotEmpty,
    IsString,
    IsEmail,
    Length,
} from 'class-validator';

export class ContactUsDTO {

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    firstName: string

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    lastName: string

    @IsNotEmpty()
    @IsEmail()
    @Length(1, 255)
    email: string

    @IsNotEmpty()
    phoneNumber: number

    @IsNotEmpty()
    @IsString()
    message: string;
}
