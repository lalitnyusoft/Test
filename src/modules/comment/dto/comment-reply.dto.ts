import { IsNotEmpty, IsOptional } from 'class-validator';
export class CommentReplyDto {
    @IsNotEmpty()
    commentId: string

    @IsOptional()
    reply: string
}