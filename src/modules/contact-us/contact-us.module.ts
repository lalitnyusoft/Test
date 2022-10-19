import { Settings } from 'src/models/settings.model';
import { Module } from '@nestjs/common';
import { ContactUsService } from './contact-us.service';
import { ContactUsController } from './contact-us.controller';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { SequelizeModule } from '@nestjs/sequelize';
@Module({
  imports: [SequelizeModule.forFeature([Settings])],
  controllers: [ContactUsController],
  providers: [ContactUsService, MailServiceService]
})
export class ContactUsModule { }
