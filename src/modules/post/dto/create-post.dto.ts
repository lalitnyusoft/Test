import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreatePostDto {
    @IsNotEmpty()
    type: string

    @IsNotEmpty()
    post: string

    @IsNotEmpty()
    attachableType: string
}