import { InjectModel } from '@nestjs/sequelize';
import { Injectable } from '@nestjs/common';
import { Settings } from 'src/models/settings.model';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { ContactUsDTO } from './dto/contactUs.dto';
import { HelperService } from 'src/services/Helper.service';

@Injectable()
export class ContactUsService {
    constructor(
        @InjectModel(Settings)
        private settingsModel: typeof Settings,
        private mailService?: MailServiceService,
    ) { }

    async postContactUs(contactUsDTO: ContactUsDTO) {
        const helperService = await new HelperService();
        console.log(contactUsDTO.firstName);

        const userData = {
            'NAME': contactUsDTO.firstName,
        };
        const retailerEmailContent = await helperService.emailTemplateContent(4, userData)
        this.mailService.sendMail(contactUsDTO.email, retailerEmailContent.subject, retailerEmailContent.body);

        const adminData = {
            'FIRST_NAME': contactUsDTO.firstName,
            'LAST_NAME': contactUsDTO.lastName,
            'EMAIL': contactUsDTO.email,
            'PHONE_NUMBER': contactUsDTO.phoneNumber,
            'MESSAGE': contactUsDTO.message,
        };
        const adminEmailContent = await helperService.emailTemplateContent(3, adminData)
        const adminEmail = await helperService.getSettings(this.settingsModel, 'info_email');
        this.mailService.sendMail(adminEmail.description, adminEmailContent.subject, adminEmailContent.body);
        return adminEmail
    }

    async findAll() {
        const settings = await this.settingsModel.findAll()
        return settings
    }
}
