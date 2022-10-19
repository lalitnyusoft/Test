import { UserService } from './user.service';
import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Request,
    UseGuards,
    UseInterceptors,
    Res,
    UploadedFiles,
    Query,
    Headers
} from '@nestjs/common';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { UserRegisterDTO } from '../auth/dto/userRegister.dto';
import { AuthGuard } from '@nestjs/passport';
import { diskStorage } from 'multer';
import path = require('path');
const uploadsProfilePath = '/profile';
const uploadsDocumentsPath = '/documents';
import { v4 as uuidv4 } from 'uuid';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { EditProfileDTO } from './dto/EditProfile.dto';
import { ChangePasswordDTO } from './dto/ChangePassword.dto';
import { EditSellerProfile } from './dto/EditSellerProfile.dto';

//document file upload
export const documentStorage = {
    storage: diskStorage({
        // destination: '.',
        destination: '../assets',
        filename: (req, file, cb) => {
            if (file.fieldname === 'profileDocument') {
                let filename: string =
                    uploadsProfilePath + '/' + path.parse('profile-').name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            }
            if (file.fieldname === 'licenseDocument') {
                let filename: string = uploadsDocumentsPath + '/' + path.parse('license-').name.replace(/\s/g, '') + uuidv4();
                const extension: string = path.parse(file.originalname).ext;
                cb(null, `${filename}${extension}`);
            }
        },
    }),
};
@Controller()
export class UserController {
    constructor(private readonly userService: UserService) { }

    @UseGuards(AuthGuard('jwt'))
    @Get()
    async user(): Promise<IResponse> {
        const users = await this.userService.getUsers();
        return new ResponseSuccess('Users', { users });
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/profile')
    async getUserProfile(@Request() req,): Promise<IResponse> {
        const user = await this.userService.getUserProfile(req.user);
        return new ResponseSuccess('User', user);
    }

    // @UseGuards(AuthGuard('jwt'))
    @Get('retailers')
    async retailers(
        @Request() req,
        @Query('offset') offset: string,
        @Query('limit') limit: string,
    ): Promise<IResponse> {
        const retailers = await this.userService.getRetailers(req.user, +offset, +limit);
        return new ResponseSuccess('retailers', retailers);
    }

    @Get('brands')
    async brands(
        @Query('offset') offset: string,
        @Query('limit') limit: string,
    ): Promise<IResponse> {
        const brands = await this.userService.getBrands(+offset, +limit);
        return new ResponseSuccess('brands', brands);
    }

    //@UseGuards(AuthGuard('jwt'))
    @Get(':slug')
    async getRetailerDetail(@Param('slug') slug: string): Promise<IResponse> {
        return new ResponseSuccess('User', await this.userService.getRetailerDetail(slug));
    }
    // @UseGuards(AuthGuard('jwt'))
    // @Get('/roles')
    // async userRole(): Promise<IResponse> {
    //     const userRoles = await this.userService.getRoles();
    //     return new ResponseSuccess('User Roles', userRoles);
    // }

    @UseGuards(AuthGuard('jwt'))
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<IResponse> {
        return new ResponseSuccess('User', await this.userService.findOne(id));
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createUser(
        @Body() createUser: UserRegisterDTO,
        @Request() req,
    ): Promise<IResponse> {
        const isCreated = await this.userService.createUser(req.user, createUser);
        return new ResponseSuccess('User added successfully.', { isCreated });
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('profile')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'profileDocument' },
        { name: 'licenseDocument' }
    ], documentStorage))
    async updateUser(
        @Body() updateUser: EditProfileDTO,
        @UploadedFiles() files: { profileDocument?: Express.Multer.File[], licenseDocument?: Express.Multer.File[] },
        @Request() req,
    ): Promise<IResponse> {
        const { id } = req.user;
        const updatedUser = await this.userService.updateProfile(
            req.user,
            updateUser,
            files
        );
        return new ResponseSuccess('User details updated successfully.', updatedUser);
    }

    @UseGuards(AuthGuard('jwt'))
    @Delete('/:id')
    async deleteUser(@Param() params): Promise<IResponse> {
        const userId = params.id;
        const deletedUser = await this.userService.deleteUser(userId);
        return new ResponseSuccess('User deleted successfully.', deletedUser);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/change-password')
    async changePassword(
        @Body() changePasswordData: ChangePasswordDTO,
        @Request() req,
    ): Promise<IResponse> {
        const changedPassword = await this.userService.changePassword(req.user, changePasswordData);
        if (changedPassword.status) {
            return new ResponseSuccess(changedPassword.message, changedPassword.status);
        }
        return new ResponseError(changedPassword.message, 'error');
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('/seller/profile')
    async getSellerProfile(@Request() req): Promise<IResponse> {
        const user = await this.userService.getSellerProfile(req.user);
        return new ResponseSuccess('User', user);
    }

    @UseGuards(AuthGuard('jwt'))
    @Put('/seller/profile')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'profileDocument' },
        { name: 'licenseDocument' }
    ], documentStorage))
    async updateSeller(
        @Body() updateSeller: EditSellerProfile,
        @UploadedFiles() files: { profileDocument?: Express.Multer.File[], licenseDocument?: Express.Multer.File[] },
        @Request() req,
    ): Promise<IResponse> {
        const { id } = req.user;
        const updatedUser = await this.userService.updateSellerProfile(
            req.user,
            updateSeller,
            files
        );
        return new ResponseSuccess('User details updated successfully.', updatedUser);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/delete')
    async deleteUserAccount(@Request() req): Promise<IResponse> {
        const response = await this.userService.deleteUserAccount(req.user);
        return new ResponseSuccess('Response', 'Your account and all the related has been deleted successfully');
    }

    @UseGuards(AuthGuard('jwt'))
    @Get('fetchById/:id')
    async fetchById(@Param('id') id: number): Promise<IResponse> {
        return new ResponseSuccess('User', await this.userService.findOne(id));
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/company')
    async fetchUserCompany(
        @Body('limit') limit: String,
        @Body('page') page: String,
        @Request() req,
    ): Promise<IResponse> {
        return new ResponseSuccess('User', await this.userService.findUserCompany(+limit, +page, req.user));
    }
}
