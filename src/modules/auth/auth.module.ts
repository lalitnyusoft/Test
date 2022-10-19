import { EmailTemplate } from './../../models/emailTemplate.model';
import { Module } from '@nestjs/common';
import { AppConstants } from 'src/constants/app.constant';
import { UserModule } from '../user/user.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategy/jwt.strategy';
import { LocalStrategy } from './strategy/local.strategy';
import { MailerModule } from '@nestjs-modules/mailer';
import { SequelizeModule } from '@nestjs/sequelize';
import { EmailTemplateHeader } from 'src/models/emailTemplateHeader.model';
import { EmailTemplateFooter } from 'src/models/emailTemplateFooter.model';
import { Settings } from 'src/models/settings.model';
import { OptionalStrategy } from './strategy/optional.strategy';
require('dotenv').config();
const { SMTP_HOST, SMTP_PORT, SMTP_USERNAME, SMTP_PASSWORD, SMTP_FROM_NAME, SMTP_FROM_EMAIL } =
  process.env;
@Module({
  imports: [
    UserModule,
    PassportModule,
    JwtModule.register({
      secret: AppConstants.jwtSecret,
      signOptions: { expiresIn: '1y' },
    }),
    MailerModule.forRoot({
      transport: {
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: false,
        auth: {
          user: SMTP_USERNAME,
          pass: SMTP_PASSWORD,
        },
      },
      // defaults: {
      //   from: '"' + SMTP_FROM_NAME + '"  ' + "<" + SMTP_FROM_EMAIL + ">"
      // },
    }),
    SequelizeModule.forFeature([EmailTemplateHeader, EmailTemplate, EmailTemplateFooter,Settings])
  ],
  controllers: [AuthController],
  providers: [AuthService, MailServiceService, LocalStrategy, JwtStrategy, OptionalStrategy]
})
export class AuthModule { }
