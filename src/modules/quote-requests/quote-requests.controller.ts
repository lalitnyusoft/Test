import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { QuoteRequestsService } from './quote-requests.service';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class QuoteRequestsController {
  constructor(private readonly quoteRequestsService: QuoteRequestsService) { }

  @Get()
  async getQuoteRequests(
    @Request() req,
    @Query('sortBy') sortBy: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    const quoteRequests = await this.quoteRequestsService.getQuoteRequests(req.user, sortBy, +offset, +limit);
    return new ResponseSuccess('Quote Requests', quoteRequests);
  }

  @Get('get-requested-quotes')
  async getRequestedQuotes(
    @Request() req,
    @Query('sortBy') sortBy: string,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ) {
    const quoteRequests = await this.quoteRequestsService.getRequestedQuotes(req.user, sortBy, +offset, +limit);
    return new ResponseSuccess('Quote Requests', quoteRequests);
  }

  @Get(':quoteId')
  async getQuoteRequestData(
    @Request() req,
    @Param('quoteId') quoteId: string,
  ) {
    const quoteData = await this.quoteRequestsService.getQuoteRequestData(req.user, quoteId);
    return new ResponseSuccess('Quote Data', quoteData);
  }

  @Post('submit-product-price')
  async submitProductsPrice(
    @Request() req,
    @Body('productsPrice') productsPrice: any,
  ) {
    const response = await this.quoteRequestsService.submitProductsPrice(req.user, productsPrice);
    if (response) {
      return new ResponseSuccess('Response', response);
    } else {
      return new ResponseError('Please enter price for all the products', response);
    }
  }

  @Post('cancel')
  async cancelQuote(
    @Request() req,
    @Body('productQuoteId') productQuoteId: string,
  ) {
    const response = await this.quoteRequestsService.cancelQuote(req.user, productQuoteId);
    if (response) {
      return new ResponseSuccess('Response', response);
    } else {
      return new ResponseError('Somethign went wrong', response);
    }
  }
}
