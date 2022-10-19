import { UserRegisterDTO } from './../../auth/dto/userRegister.dto';
import {
    IsNotEmpty,
    IsString,
    IsEmail,
    Length,
    MaxLength,
    IsOptional,
    IsNumberString,
} from 'class-validator';

export class CreateBrandDto extends UserRegisterDTO {

    @IsNotEmpty()
    @IsString()
    @Length(1, 255)
    brandName: string;

    @IsOptional()
    logoPath: string;

    @IsOptional()
    website: string;

    @IsOptional()
    year: string;

    @IsOptional()
    //@IsNumberString()
    avgOrder: string;

    @IsOptional()
    address: string;

    @IsOptional()
    description: string;

    @IsOptional()
    avgProductRating: number;

    @IsOptional()
    reviewsProductCount: number;

    @IsOptional()
    avgDOTRating: number;

    @IsOptional()
    reviewsDOTCount: number;

    @IsOptional()
    avgGeneralRating: number;

    @IsOptional()
    reviewsGeneralCount: number;

    @IsOptional()
    avgRating: number;

    // @IsOptional()
    // reviewsCount: number;

    @IsOptional()
    cardNumber: string;

    @IsOptional()
    cardExpiry: string;

    @IsOptional()
    cardCvc: string;

    @IsOptional()
    cardHolder: string
}
