import { EmailTemplate } from './../../models/emailTemplate.model';
import { HelperService } from 'src/services/Helper.service';
import { UserAuthenticateInterface } from './../user/interfaces/userAuthenticate.interface';
import { BadRequestException, Injectable, UnauthorizedException, UnprocessableEntityException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { UserLoginDTO } from './dto/UserLogin.dto';
import { JwtUserDTO } from './dto/JwtUser.dto';
import { UserRegisterDTO } from './dto/userRegister.dto';
import { UserForgotPassword } from './dto/UserForgotPassword.dto';
import { resetPasswordTemplate } from '../../mail-service/templates/reset_password.mail';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { MailerService } from '@nestjs-modules/mailer';
import { Settings } from 'src/models/settings.model';
import { Op } from 'sequelize';
const bcrypt = require('bcryptjs');
const { MAIL_FROM } = process.env;
const { FRONEND_BASE_URL, ADMIN_BASE_URL } = process.env;
@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private jwtService: JwtService,
        @InjectModel(User)
        private userModel: typeof User,
        @InjectModel(EmailTemplate)
        private emailTemplateModel: typeof EmailTemplate,
        @InjectModel(Settings)
        private settingsModel: typeof Settings,
        private readonly mailerService: MailerService,
        private mailService?: MailServiceService,
    ) { }

    async login(userLoginDTO: UserLoginDTO) {
        const userAuthenticateInterface: UserAuthenticateInterface = {
            username: userLoginDTO.username,
            password: userLoginDTO.password,
        };
        const user = await this.userService.authenticate(userAuthenticateInterface);
        if (!user) throw new UnauthorizedException();
        return user;
    }

    async signJWT(user: JwtUserDTO) {
        const payload = {
            id: user.id,
            email: user.email,
        };

        const token = this.jwtService.sign(payload);
        return token;
    }

    async registerUser(userRegisterDTO: UserRegisterDTO, file) {
        const checkEmail = await this.checkEmail(userRegisterDTO.email);
        const licenseDocumentPath = await file ? file.filename : null;
        if (userRegisterDTO.password !== userRegisterDTO.confirmPassword) {
            throw new ForbiddenException('Password and confirm password does not match.');
        }
        const hash = bcrypt.hashSync(userRegisterDTO.password, 10);
        // let slug = (userRegisterDTO.firstName+' '+userRegisterDTO.lastName).toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        let slug = (userRegisterDTO.businessName).toLowerCase().replace(/ /g,'-').replace(/[^\w-]+/g,'');
        const existUserWithSlug = await this.userModel.findAndCountAll({
            where: {
              slug: {
                [Op.like] : `%${slug}%`
              }
            },
          });
          if(existUserWithSlug.count){
            slug = slug+'-'+existUserWithSlug.count;
          }
        const user = await this.userModel.create({
            email: userRegisterDTO.email,
            // firstName: userRegisterDTO.firstName,
            // lastName: userRegisterDTO.lastName,
            businessName: userRegisterDTO.businessName,
            slug: slug,
            password: hash,
            role: userRegisterDTO.role,
            stateId: userRegisterDTO.selectedState,
            zipCode: userRegisterDTO.zipCode,
            phoneNumber: userRegisterDTO.phoneNumber,
            licenseNumber: userRegisterDTO.licenseNumber,
            medRecId: userRegisterDTO.medRecId,
            expirationDate: userRegisterDTO.expirationDate,
            profilePath: userRegisterDTO.profilePath,
            licensePath: licenseDocumentPath,
            //planId: userRegisterDTO.planId,
            //LogoPath: brandLogoPath
            planExpiryDate: userRegisterDTO.planExpiryDate,
            subscriptionId: userRegisterDTO.subscriptionId,
        });
        const helperService = await new HelperService();
        const userData = {
            // 'NAME': user.firstName+' '+user.lastName,
            'NAME': user.businessName,
            'LINK': FRONEND_BASE_URL+'/sign-in'
        };
        const retailerEmailContent = await helperService.emailTemplateContent(1, userData)
        this.mailService.sendMail(user.email, retailerEmailContent.subject, retailerEmailContent.body);

        const adminData = {
            // 'NAME': user.firstName+' '+user.lastName,
            'NAME': user.businessName,
            'EMAIL': user.email,
            'ROLE': 'Retailer',
            'LINK': ADMIN_BASE_URL+'/buyer/edit/'+user.id
        };
        const adminEmailContent = await helperService.emailTemplateContent(5, adminData)
        const adminEmail = await helperService.getSettings(this.settingsModel, 'info_email');
        this.mailService.sendMail(adminEmail.description, adminEmailContent.subject, adminEmailContent.body);
        return user;
    }

    async forgotPassword(userForgotPassword: UserForgotPassword) {
        const user = await this.userModel.findOne({
            where: { email: userForgotPassword.email },
        });
        if (!user) throw new UnprocessableEntityException('Invalid email.');
        const verification_token = bcrypt.hashSync(
            `${user.email}-${user.id}`,
            10,
          );
        await user.update({
            verification_token: verification_token
        });
        const helperService = await new HelperService();
        const userData = {
            // 'NAME': user.firstName+(user.lastName ? ' '+user.lastName : ''),
            'NAME': user.businessName,
            'LINK': FRONEND_BASE_URL+'/reset-password?token='+verification_token,
            'LINK_1': FRONEND_BASE_URL+'/contact-us'
        };
        const emailContent = await helperService.emailTemplateContent(2, userData)
        this.mailService.sendMail(user.email, emailContent.subject, emailContent.body);
        return true;
    }

    async resetPassword(token: string, password: string, confirm_password: string) {
        let status: boolean = true;
        let message : string = '';
        const user = await this.userModel.findOne({
            attributes: ['password', 'id'],
            where: {
                verification_token: token,
                // deletedAt: null
            },
        });
        if (!user) {
            return {
                status: false,
                message: "User doesn't exist"
            }
        // throw new BadRequestException();
        }
        if(user.verification_token){
            return{
                status: false,
                message: "Password has already been reset, please login"
            }
        }
        if(password !== confirm_password){
            return{
                status: false,
                message: "Password and confirm password mismatched"
            }
        }
        const hash = bcrypt.hashSync(password, 10);
        const userExisted = await this.userModel.findOne({
            where: {
                id: user.id,
                // deletedAt: null
            },
        });
        await user.update({
            password: hash,
            verification_token: null
        });
        return {status, message};
    }

    async checkEmail(emailId) {
        const emailExist = await this.userModel.findOne({
            where: {
                email: emailId,
            },
        });
        if (emailExist) {
            throw new UnprocessableEntityException(
                'Email already exist, Please try another.',
            );
        }
    }
}
