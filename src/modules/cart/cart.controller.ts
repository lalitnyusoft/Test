import { Body, Controller, Delete, Get, Post, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { CartService } from './cart.service';

@Controller()
@UseGuards(AuthGuard('jwt'))
export class CartController {
  constructor(private readonly cartService: CartService) { }
  
  @Get('/get-items')
  async getCartItems(
    @Request() req
  ) {
    // await new Promise(f => setTimeout(f, 2000)); // for add delay in output
    const cartItems = await this.cartService.getCartItems(req.user);
    return new ResponseSuccess('cart items', cartItems);
  }
  
  @Post('/add-item')
  async addItem(
    @Request() req,
    @Body('productSlug') productSlug: string,
    @Body('quantity') quantity: string
  ) {
    const addedItem = await this.cartService.addItem(req.user, productSlug, +quantity);
    return new ResponseSuccess('added item', addedItem);
  }

  @Delete('/remove-item')
  async removeItem(
    @Request() req,
    @Body('cartId') cartId: string,
  ) {
    const removedItemId = await this.cartService.removeItem(req.user, +cartId);
    return new ResponseSuccess('removed item', removedItemId);
  }

  @Post('/request-quote')
  async requestQuote(
    @Request() req
  ) {
    const requestedQuote = await this.cartService.requestQuote(req.user);
    return new ResponseSuccess('Requested Quote', requestedQuote);
  }

  @Put('/update-quantity')
  async updateItemQuantity(
    @Request() req,
    @Body('action') action: string,
    @Body('cartId') cartId: string,
    @Body('quantity') quantity: string
  ) {
    const updatedItems = await this.cartService.updateItemQuantity(req.user, action, +cartId, +quantity);
    return new ResponseSuccess('Updated Items', updatedItems);
  }
}
