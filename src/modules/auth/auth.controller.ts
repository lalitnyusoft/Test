import { AuthGuard } from '@nestjs/passport';
import {
  Controller, Post, UseGuards, Request as RequestDec, Body, Get, UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { UserRegisterDTO } from './dto/userRegister.dto';
import { UserForgotPassword } from './dto/UserForgotPassword.dto';
import { ResetPasswordDTO } from './dto/ResetPassword.dto';
import { diskStorage } from 'multer';
import path = require('path');
const documentPath = '/uploads/documents';
import { v4 as uuidv4 } from 'uuid';
import { FileInterceptor } from '@nestjs/platform-express';

//document file uploads
export const documentStorage = {
  storage: diskStorage({
    // destination: '.' + documentPath,
    destination: '../assets',
    filename: (req, file, cb) => {
      let filename: string =
          '/documents/' + path.parse('license-').name.replace(/\s/g, '') + uuidv4();
      filename = filename;
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller()
export class AuthController {
    constructor(private readonly authService: AuthService) { }

    @UseGuards(AuthGuard('local'))
    @Post('login')
    async login(
        @RequestDec() req,
    ): Promise<IResponse> {
        const user: any = req.user;
        const access_token = await this.authService.signJWT(user);
        return new ResponseSuccess('Login', { access_token, user });
    }

  // @Post('register')
  // @UseInterceptors(FileInterceptor('licenseDocument', documentStorage))
  // async register(@Body() registerUser: UserRegisterDTO, @UploadedFile() file,): Promise<IResponse> {
  //   const isRegistered = await this.authService.registerUser(registerUser, file);
  //   return new ResponseSuccess('Register', isRegistered);
  // }

  @Post('register')
  @UseInterceptors(FileInterceptor('licenseDocument', documentStorage))
  async register(@Body() registerUser: UserRegisterDTO, @UploadedFile() file,): Promise<IResponse> {
    const isRegistered = await this.authService.registerUser(registerUser, file);
    return new ResponseSuccess('Register', isRegistered);
  }


    @Get('getServerConfiguration')
    async getServerConfiguration(): Promise<IResponse> {
        // var date = moment();
        // console.log(date);
        return new ResponseSuccess('Configuration ', { today: new Date() });
        // return new ResponseSuccess("Configuration ", { "today": new Date("2021/11/03") });
    }

    @Post('forgot-password')
    async forgotPassword(
      @Body() userForgotPassword: UserForgotPassword,
    ): Promise<IResponse> {
      const isLinkSend = await this.authService.forgotPassword(
        userForgotPassword,
      );
      return new ResponseSuccess('Password rest link has been sent', isLinkSend);
    }

    @Post('reset-password')
    async resetPassword(
      @Body() resetPasswordDTO: ResetPasswordDTO,
    ): Promise<IResponse> {
      const isLinkSend = await this.authService.resetPassword(
        resetPasswordDTO.token,
        resetPasswordDTO.password,
        resetPasswordDTO.confirm_password,
      );
      if(isLinkSend.status) {
        return new ResponseSuccess('Password has been reset successfully, you can log in now', isLinkSend);
      }
      else {
        return new ResponseError(isLinkSend.message, isLinkSend);
      }
    }
}
