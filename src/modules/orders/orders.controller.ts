import { Controller, Get, UseGuards, Request, Query, Post, Param, Body } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { ReviewDto } from './dto/review.dto';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('retailer')
  async retailerOrders(
    @Request() req,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('category') category: string,
    @Query('sortBy') sortBy: string,
    @Query('keyword') keyword: string,
  ): Promise<IResponse> {
    const orders = await this.ordersService.retailerOrders(req.user, category, sortBy, keyword, +offset, +limit);
    return new ResponseSuccess('Orders', orders)
  }

  @Get('seller')
  async sellerOrders(
    @Request() req,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
    @Query('category') category: string,
    @Query('sortBy') sortBy: string,
    @Query('keyword') keyword: string,
  ): Promise<IResponse> {
    const orders = await this.ordersService.sellerOrders(req.user, category, sortBy, keyword, +offset, +limit);
    return new ResponseSuccess('Orders', orders)
  }

  @Post(':orderId/review')
  async postReview(
    @Param('orderId') orderId: string,
    @Body() reviewDto: ReviewDto,
    @Request() req,
  ){
    const review = await this.ordersService.postReview(req.user, orderId, reviewDto);
      return new ResponseSuccess('Review submitted successfully', true)
  }

  @Post(':orderId/:action')
  async updateOrder(
    @Param('orderId') orderId: string,
    @Param('action') action: string,
    @Request() req,
  ){
    const orders = await this.ordersService.updateOrders(req.user, orderId, action);
    if(orders.status){
      return new ResponseSuccess(orders.message, orders.status)
    } else {
      return new ResponseError('Something went wrong', false)
    }
  }

}
