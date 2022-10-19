import { IsNotEmpty, IsString, Matches, MinLength } from "class-validator";

export class ChangePasswordDTO{
    @IsNotEmpty({ message: 'Current password is required' })
    @IsString()
    @MinLength(6, {
        message: 'Current password must be longer than or equal to 6 characters',
    })
    currentPassword: string

    @IsNotEmpty({ message: 'new password is required' })
    @IsString()
    @MinLength(6, {
        message: 'New password must be longer than or equal to 6 characters',
    })
    newPassword: string;
  
    @IsNotEmpty({ message: 'confirm new password is required' })
    @IsString()
    @MinLength(6, {
        message: 'Confirm new password must be longer than or equal to 6 characters',
    })
    confirmNewPassword: string;
}