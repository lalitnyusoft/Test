import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateRepostDto {
    @IsNotEmpty()
    type: number

    @IsNotEmpty()
    post: string

    @IsNotEmpty()
    repostId: number
}