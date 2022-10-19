import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Cart } from 'src/models/cart.model';
import { Category } from 'src/models/category.model';
import { Product } from 'src/models/product.model';
import { ProductQuote } from 'src/models/productQuote.model';
import { ProductQuoteItem } from 'src/models/productQuoteItem.model';
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart)
    private cartModel: typeof Cart,
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(ProductQuote)
    private productQuoteModel: typeof ProductQuote,
    @InjectModel(ProductQuoteItem)
    private productQuoteItemModel: typeof ProductQuoteItem
  ) { }

  async getCartItems(jwtUserDTO: JwtUserDTO) {
    const cartItems = await this.cartModel.findAll({
      include: [
        {
          model: Product,
          include: [{
            model: Category,
            attributes: ['title']
          }],
          attributes: [
            'id',
            'title',
            'harvested',
            'brandId'
          ],
        },
      ],
      where: {
        retailerId: jwtUserDTO.id
      },
      attributes: [
        'id',
        'quantity'
      ],
    })

    const cartData: any = await this.cartModel.findAll({
      attributes: [
        'brandId',
        [Sequelize.fn('sum', Sequelize.col('quantity')), 'totalItems'],
      ],
      where: {
        retailerId: jwtUserDTO.id
      },
      group: ['brandId'],
      raw: true
    });
    const brandId = cartData.length && cartData[0].brandId ? cartData[0].brandId : '';
    const totalItems = cartData.length && cartData[0].totalItems ? cartData[0].totalItems : 0;
    
    return { brandId: brandId, totalItems: totalItems, cartItems };
  }

  async addItem(jwtUserDTO: JwtUserDTO, productSlug: string, quantity: number) {
    const product = await this.productModel.findOne({
      where: {slug: productSlug}
    })
    if (!product) throw new NotFoundException('Product Not Found');
    const existingItemsFromSameBrandInCart = await this.cartModel.findAll({
      where: {
        retailerId: jwtUserDTO.id,
        brandId: product.brandId
      }
    });
    if (existingItemsFromSameBrandInCart && existingItemsFromSameBrandInCart.length) {
      const existingItemInCart = await this.cartModel.findOne({
        where: {
          retailerId: jwtUserDTO.id,
          brandId: product.brandId,
          productId: product.id
        }
      });
      if (existingItemInCart) {
        let updatedQuantity;
        if (existingItemInCart.quantity === 99999) {
          throw new ForbiddenException('You have added maximum number of quantity of product, can not add more quantity now')
        } else if ((existingItemInCart.quantity + quantity) > 99999) {
          updatedQuantity = 99999
        } else {
          updatedQuantity = existingItemInCart.quantity + quantity
        }
        await existingItemInCart.update({
          quantity: updatedQuantity
        })
        // return { product: { ...existingItemInCart.toJSON() } }
      } else {
        const item = await this.cartModel.create({
          retailerId: jwtUserDTO.id,
          brandId: product.brandId,
          productId: product.id,
          quantity
        });
        // return { product: { ...item.toJSON() } }
      }
    } else {
      const existingItemFromDifferentBrandInCart = await this.cartModel.findAll({
        where: {
          retailerId: jwtUserDTO.id
        }
      });
      if (existingItemFromDifferentBrandInCart && existingItemFromDifferentBrandInCart.length) {
        await this.cartModel.destroy({
          where: {
            retailerId: jwtUserDTO.id
          }
        });
      }
      const item = await this.cartModel.create({
        retailerId: jwtUserDTO.id,
        brandId: product.brandId,
        productId: product.id,
        quantity
      });
    }
    return this.getCartItems(jwtUserDTO);
  }

  async removeItem(jwtUserDTO: JwtUserDTO, cartId: number) {
    const item = await this.cartModel.findOne({
      where: {
        id: cartId,
        retailerId: jwtUserDTO.id
      }
    })
    if (!item) throw new NotFoundException();
    await item.destroy();
    return this.getCartItems(jwtUserDTO);
  }

  async requestQuote(jwtUserDTO: JwtUserDTO) {
    const cartItems = await this.cartModel.findAll({
      where: {
        retailerId: jwtUserDTO.id
      }
    });
    if(!cartItems.length) throw new NotFoundException('No items found in cart');
    const TotalcartItems = await this.cartModel.findOne({
      attributes: [
          [Sequelize.fn('SUM', Sequelize.col('quantity')), 'total_quantity'],
        ],
      where: {
        retailerId: jwtUserDTO.id
      }
    });
    const productQuote = await this.productQuoteModel.create({
      retailerId: jwtUserDTO.id,
      brandId: cartItems[0].brandId,
      status: 1
    })

    cartItems.forEach(async (item) => {
      await this.productQuoteItemModel.create({
        productQuoteId: productQuote.id,
        productId: item.productId,
        quantity: item.quantity,
      })
      item.destroy();
    })
    await productQuote.update({ quoteId: 'QT' + String(productQuote.id).padStart(8, '0'), totalQuantity: TotalcartItems.toJSON().total_quantity });
    return true;
  }

  async updateItemQuantity(jwtUserDTO: JwtUserDTO, action: string, cartId: number, quantity: number) {
    const existCart = await this.cartModel.findOne({
      where: {
        id: cartId
      }
    });
    if (!existCart) throw new NotFoundException();
    let updatedQuantity;
    if ((action === 'decrement' && existCart.quantity > 1) || (action === 'increment' && existCart.quantity < 99999) || (action === 'manual' && existCart.quantity <= 99999)) {
      if (action === 'manual') {
        updatedQuantity = quantity
      } else {
        updatedQuantity = existCart.quantity + quantity
      }
      await existCart.update({
        quantity: updatedQuantity
      });
    }
    return ({ action, cartId, quantity: existCart.quantity });
  }
}
