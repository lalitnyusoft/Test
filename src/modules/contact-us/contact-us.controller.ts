import { Controller, Post, Get, Body } from '@nestjs/common';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ContactUsService } from './contact-us.service';
import { ContactUsDTO } from './dto/contactUs.dto';

@Controller()
export class ContactUsController {
  constructor(private readonly contactUsService: ContactUsService) { }

  @Post()
  async postContactUs(
    @Body() contactUs: ContactUsDTO,
  ): Promise<IResponse> {
    const isLinkSend = await this.contactUsService.postContactUs(contactUs)
    return new ResponseSuccess('We will review your message and come back to you shortly. Thank you for reaching out to String. We look forward to connecting soon.', isLinkSend);
  }

  @Post('/settings')
  async findAll() {
    const settings = await this.contactUsService.findAll();
    return new ResponseSuccess('Setting details', settings);
  }
}
