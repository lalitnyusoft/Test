import { IsNotEmpty, IsOptional } from "class-validator"

export class GetReplyDto {
    @IsNotEmpty()
    commentUniqueId: string
}