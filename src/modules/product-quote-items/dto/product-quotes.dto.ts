import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateProductDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    categoryId: string

    @IsNotEmpty()
    medRecId: string

    @IsNotEmpty()
    // @IsNumber()
    price: string;

    @IsNotEmpty()
    // @IsNumber()
    strainId: string

    @IsNotEmpty()
    @IsString()
    dominant: string

    @IsNotEmpty()
    // @IsNumber()
    iOId: string

    @IsNotEmpty()
    harvested: Date

    @IsNotEmpty()
    // @IsNumber()
    thc: string

    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    productImages: string[];

}
