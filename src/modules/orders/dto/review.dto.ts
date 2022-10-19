import { IsNotEmpty, IsNumberString, IsString } from 'class-validator';

export class ReviewDto {

    @IsNotEmpty()
    quality_rating: number

    @IsNotEmpty()
    @IsString()
    quality_review: string

    @IsNotEmpty()
    dot_rating: number

    @IsNotEmpty()
    @IsString()
    dot_review: string

    @IsNotEmpty()
    general_rating: number

    @IsNotEmpty()
    @IsString()
    general_review: string
}
