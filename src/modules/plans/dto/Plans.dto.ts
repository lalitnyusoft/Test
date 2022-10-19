import {
    IsNotEmpty,
    IsString,
    IsEmail,
    Length,
    MaxLength,
    IsOptional,
} from 'class-validator';

export class PlansDto {

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    title: string;

    @IsOptional()
    slug: string;

    @IsNotEmpty()
    price: number;

    @IsNotEmpty()
    description: string;
}
