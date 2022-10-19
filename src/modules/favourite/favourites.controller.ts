import { Controller, Get, UseGuards, Request, Query, Post, Param, Body } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class FavouritesController {
  constructor(private readonly favouritesService: FavouritesService) {}

  @Post('handle/favourite/:slug')
  async handleFavourites(
    @Request() req,
    @Param('slug') slug: string,
  ): Promise<IResponse> {
    const favouriteProducts = await this.favouritesService.handleFavourites(req.user, slug);
    if(favouriteProducts.status){
      return new ResponseSuccess(favouriteProducts.message, favouriteProducts)
    } else {
      return new ResponseError(favouriteProducts.message, favouriteProducts)
    }
  }

  @Get('')
  async myFavourites(
    @Request() req,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ): Promise<IResponse> {
    const favouriteProducts = await this.favouritesService.myFavourites(req.user, +offset, +limit);
    return new ResponseSuccess('favouriteProducts', favouriteProducts)
  }

  // @Post(':orderId/:action')
  // async updateOrder(
  //   @Param('orderId') orderId: string,
  //   @Param('action') action: string,
  //   @Request() req,
  // ){
  //   const orders = await this.favouritesService.updateOrders(req.user, orderId, action);
  //   if(orders.status){
  //     return new ResponseSuccess(orders.message, orders.status)
  //   } else {
  //     return new ResponseError('Something went wrong', false)
  //   }
  // }
}
