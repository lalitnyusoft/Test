import { IsEnum, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';

export class QuickUpdateProductDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNotEmpty()
    categoryId: string

    @IsNotEmpty()
    medRecId: string

    @IsNotEmpty()
    strainId: string

    @IsNotEmpty()
    thc: string

    @IsNotEmpty()
    flavor: string;

    @IsNotEmpty()
    @IsString()
    dominant: string

    @IsNotEmpty()
    iOId: string

    @IsNotEmpty()
    harvested: Date
}
