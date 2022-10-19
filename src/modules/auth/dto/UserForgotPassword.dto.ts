import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class UserForgotPassword {
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  email: string;
}
