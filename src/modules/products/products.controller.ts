import { User } from 'src/models/user.model';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Put, Request, UseInterceptors, UploadedFile, UploadedFiles, HttpCode, Query } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path = require('path');
import { v4 as uuidv4 } from 'uuid';
import { QuickUpdateProductDto } from './dto/quick-update-product.dto';

export const productStorage = {
  storage: diskStorage({
    destination: '../assets',
    filename: (req, file, cb) => {
      let filename: string =
        '/products/'+path.parse(file.fieldname === 'labResults' ? 'product-lab-results' : 'product-').name.replace(/\s/g, '') + uuidv4();
      filename = filename;
      const extension: string = path.parse(file.originalname).ext;
      cb(null, `${filename}${extension}`);
    },
  }),
};

@Controller()
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @UseGuards(AuthGuard('jwt'))
  @HttpCode(200)
  @Post()
  @UseInterceptors(FileInterceptor('labResults', productStorage))
  async addProduct(
    @Body() createProductDto: CreateProductDto,
    @Request() req,
    @UploadedFile() labResults
  ): Promise<IResponse> {
    const isCreated = await this.productsService.addProduct(createProductDto, req.user, labResults);
    return new ResponseSuccess('Product added successfully.', isCreated);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/image-upload')
  @UseInterceptors(FileInterceptor('file', productStorage))
  async uploadProductImage(
    @UploadedFile() file,
  ): Promise<IResponse> {
    const isUploaded = await this.productsService.uploadProductImage(file);
    return new ResponseSuccess('Product image uploaded successfully.', isUploaded);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete('/image-remove')
  async removeProductImage(
    @Body('filePath') filePath: string,
  ): Promise<IResponse> {
    const isRemoved = await this.productsService.removeProductImage(filePath);
    return new ResponseSuccess('Product image removed successfully.', isRemoved);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':slug')
  @UseInterceptors(FileInterceptor('labResults', productStorage))
  async updateProduct(
    @Param('slug') slug: string,
    @Body() updateProductDto: UpdateProductDto,
    @Request() req,
    @UploadedFile() labResults
  ): Promise<IResponse> {
    const product = await this.productsService.updateProduct(slug, updateProductDto, req.user, labResults)
    return new ResponseSuccess('Product updated successfully.', product)
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('quick-edit/:slug')
  async quickUpdateProduct(
    @Param('slug') slug: string,
    @Body() quickUpdateProductDto: QuickUpdateProductDto,
    @Request() req
  ): Promise<IResponse> {
    const product = await this.productsService.quickUpdateProduct(slug, quickUpdateProductDto, req.user)
    return new ResponseSuccess('Product updated successfully.', product)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll() {
    const product = await this.productsService.findAllProduct();
    return new ResponseSuccess('Products.', product)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('my')
  async getMyProducts(
    @Request() req,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('category') category: string,
    @Query('sortBy') sortBy: string,
    @Query('keyword') keyword: string,
  ) {
    const product = await this.productsService.getMyProducts(req.user, category, sortBy, keyword, +offset, +limit);
    return new ResponseSuccess('Products.', product)
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('retailer')
  async getAllProduct(
    @Request() req,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('sortBy') orderBy: string,
    @Query('keyword') keyword: string,
    @Query('category') category: string,
    @Query('medRec') medRec: string,
    @Query('priceMin') priceMin: string,
    @Query('priceMax') priceMax: string,
    @Query('thcMin') thcMin: string,
    @Query('thcMax') thcMax: string,
    @Query('strain') strain: string,
    @Query('io') iorO: string,
  ) {
    const product = await this.productsService.getAllProduct(req.user, +offset, +limit, orderBy, keyword, category, medRec, +priceMin, +priceMax, +thcMin, +thcMax, strain, iorO);
    return new ResponseSuccess('Products.', product)
  }

  @Get('review')
  async productReview(
    @Query('slug') slug: string,
    @Query('page') page: string,
    @Query('limit') limit: string,
  ): Promise<IResponse> {
    const productReview = await this.productsService.productReview(slug, page, limit);
    return new ResponseSuccess('reviews', productReview);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':slug')
  async findOne(
    @Request() req,
    @Param('slug') slug: string
  ) {
    const product = await this.productsService.findOne(req.user, slug)
    return new ResponseSuccess('Product.', product)
  }

  @Get(':slug/admin')
  async findProduct(
    @Param('slug') slug: string
  ) {
    const product = await this.productsService.findProduct(slug)
    return new ResponseSuccess('Product.', product)
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':slug')
  async deleteProduct(@Param('slug') slug: string,) {
    const product = await this.productsService.deleteProduct(slug)
    return new ResponseSuccess('Product deleted successfully.', product)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('order')
  async requestOrder(
    @Request() req,
    @Body('productData') productData: any,
    @Body('productQuoteId') productQuoteId: number,
  ): Promise<IResponse> {
    const product = await this.productsService.requestOrder(req.user, productData, productQuoteId);
    return new ResponseSuccess('Order placed successfully.', product)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('change/status/:slug')
  async changeProductStatus(
    @Param('slug') slug: string,
  ): Promise<IResponse> {
    const updatedProduct = await this.productsService.changeProductStatus(slug);
    if(+updatedProduct.isActive === 1){
      return new ResponseSuccess('Product has been enabled', updatedProduct)
    } else {
      return new ResponseSuccess('Product has been disabled', updatedProduct)
    }
  }
}
