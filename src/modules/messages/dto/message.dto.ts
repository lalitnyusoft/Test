import {
    IsNotEmpty,
    IsString,
    IsOptional,
} from 'class-validator';

export class MessageDto {

    @IsNotEmpty()
    slug: string;

    @IsNotEmpty()
    @IsOptional()
    @IsString()
    message: string;
    
    @IsOptional()
    attachment: string;
}