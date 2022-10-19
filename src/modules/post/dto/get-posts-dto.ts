import { IsNotEmpty } from 'class-validator';

export class GetPostDto {
    @IsNotEmpty()
    type: string

    @IsNotEmpty()
    slug: string

    @IsNotEmpty()
    page: string

    @IsNotEmpty()
    limit: string
}