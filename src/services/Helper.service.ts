import { BadRequestException, Injectable, Request } from '@nestjs/common';
import { EmailTemplate } from 'src/models/emailTemplate.model';
import { EmailTemplateFooter } from 'src/models/emailTemplateFooter.model';
import { EmailTemplateHeader } from 'src/models/emailTemplateHeader.model';
const { ASSETS_URL } = process.env;
@Injectable()
export class HelperService {
    async checkUnique(model: any, field: any, data: any, fieldName?: any) {
        const isUnique = await model.findOne({
            where: {
                [field]: data,
            },
            paranoid: false,
        });
        if (isUnique) {
            throw new BadRequestException(fieldName + ' is already exist.');
        } else return true;
    }
    async updateCreatedBy(@Request() req) {
        console.log(req.user);
    }

    async getSettings(model: any, name: any) {
        if (name) {
            const description = await model.findOne({
                where: {
                    name: name
                },
                attributes: ['description']
            })
            return description;
        } else {
            return false
        }
    }


    async emailTemplateContent(id: number, userData: any) {
        // userData['LOGO'] = 'https://gmx.nyusoft.in:6001/api/v1/get/file/uploads/settings/main-logo.png'
        userData['LOGO'] = ASSETS_URL+'/settings/main-logo.png';
        userData['COPYRIGHTYEAR']	=  new Date().getFullYear();
        const keysArr = [
            '{ORDER_ID}',
            '{QUOTE_ID}',
            '{LOGO}',
            '{COPYRIGHTYEAR}',
            '{NAME}',
            '{LINK}',
            '{LINK_1}',
            '{EMAIL}',
            '{ROLE}',
            '{PLAN}',
            '{PHONE}',
            '{MESSAGE}',
            '{TITLE}',
            '{ORDERID}',
            '{QUOTEID}',
            '{PRODUCT}',
            '{CATEGORY}',
            '{CUSTOMER}',
            '{QUANTITY}',
            '{PRICE}',
            '{TOTAL}',
            '{BRAND}',
            '{FIRST_NAME}',
            '{LAST_NAME}',
            '{PHONE_NUMBER}',
        ]
        const emailTemplate = await EmailTemplate.findOne({
            where: {
                id
            },
            include: [
                {
                    model: EmailTemplateHeader
                },
                {
                    model: EmailTemplateFooter
                },
            ]
        })
        let onlyString = emailTemplate.body;
        let string = '';
        string = emailTemplate.header.description;
        string += emailTemplate.body;
        string += emailTemplate.footer.description;
        let subject = emailTemplate.subject;
        keysArr.forEach(key => {
            let k = key.replace("{", "");
            k = k.replace("}", "");
            if(userData[k]){
                onlyString = onlyString.replace(key, userData[k]);
                string = string.replace(key, userData[k]);
                subject = subject.replace(key, userData[k]);
            }
        });
        return {
            'subject': subject,
            'onlyBody': onlyString,
            'body': string
        };
    }
}

