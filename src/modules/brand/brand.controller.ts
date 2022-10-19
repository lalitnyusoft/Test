import { UserRegisterDTO } from './../auth/dto/userRegister.dto';
import { Body, Controller, Delete, Get, Param, Post, Put, Request, UploadedFiles, UseGuards, UseInterceptors, Query } from '@nestjs/common';
import { BrandService } from './brand.service';
import { CreateBrandDto } from './dto/create-brand.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { AuthGuard } from '@nestjs/passport';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { FileHelper } from 'src/services/FileHelper.service';
import path = require('path');
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
export const productInvoiceStorage = {
  storage: diskStorage({
    destination: '../assets/invoice',
  }),
};
@Controller()
export class BrandController {
  constructor(private readonly brandService: BrandService) { }

  // @Post()
  // create(@Body() createBrandDto: CreateBrandDto) {
  //   return this.brandService.create(createBrandDto);
  // }

  //@UseGuards(AuthGuard('jwt'))
  @Post('/register')
  @UseInterceptors(
    FileFieldsInterceptor(
      [
        {
          name: 'licenseDocument',
          maxCount: 1,
        },
        {
          name: 'profileDocument',
          maxCount: 1,
        },
      ],
      {
        storage: diskStorage({
          // destination: FileHelper.destinationPath,
          destination: '../assets',
          filename: FileHelper.customFileName,
        }),
      },
    ),
  )
  /* async createBrand(
    @Body() createBrand: CreateBrandDto
    //@Body()
  ): Promise<IResponse> { */
  async createBrand(@Body() createBrandDto: CreateBrandDto, @UploadedFiles() file: { avatar?: [], background?: [] }): Promise<IResponse> {
    const isCreated = await this.brandService.createBrand(createBrandDto, file);
    return new ResponseSuccess('Brand added successfully.', isCreated);
  }

  //@UseGuards(AuthGuard('jwt'))
  @Get()
  async brand(): Promise<IResponse> {
    const brand = await this.brandService.findAll();
    return new ResponseSuccess('Brand', brand);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('subscription')
  async subscriptionDetails(@Request() req) {
    const subscription = await this.brandService.subscriptionDetails(req.user)
    return new ResponseSuccess('subscription', subscription);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('invoice/:invoiceId')
  async generateInvoice(@Param('invoiceId') invoiceId: string, @Request() req) {
    const invoice = await this.brandService.generateInvoice(req.user, +invoiceId)
    return new ResponseSuccess('Invoice', invoice);
  }

  /* seller/brand review  */
  @Get('review')
  async brandReview(
    @Query('slug') slug: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<IResponse> {
    const brandReview = await this.brandService.brandReview(slug, page, limit);
    return new ResponseSuccess('reviews', brandReview);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/profile')
  async getProfile(
    @Request() req
  ) {
    const brand = await this.brandService.getProfile(req.user);
    return new ResponseSuccess('Brand', brand);
  }

  @UseGuards(JwtAuthGuard)
  @Get('/:slug')
  async findSingleBrand(
    @Request() req,
    @Param('slug') slug: string
  ) {
    const brand = await this.brandService.findSingleBrand(slug, req.user);
    return new ResponseSuccess('Brand', brand);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('cancel-subscription')
  async cancelSubscription(
    @Request() req
  ): Promise<IResponse> {
    const planSubscription = await this.brandService.cancelSubscription(req.user)
    return new ResponseSuccess('Subscription cancelled successfully.', planSubscription)
  }

  /*@Put(':id')
  update(@Param('id') id: string, @Body() updateBrandDto: UpdateBrandDto) {
    return this.brandService.update(+id, updateBrandDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.brandService.remove(+id);
  } */

}
