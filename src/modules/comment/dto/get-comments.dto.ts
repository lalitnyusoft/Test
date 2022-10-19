import { IsNotEmpty, IsOptional } from "class-validator"

export class GetCommentDto {
    @IsOptional()
    postId: number

    // @IsNotEmpty()
    // page: number

    // @IsNotEmpty()
    // limit: number
}