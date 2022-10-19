import { IsNotEmpty, IsOptional } from 'class-validator';
export class CreateCommentDto {
    @IsOptional()
    comment: string

    @IsNotEmpty()
    postId: string
}