import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from 'src/models/category.model';
import { Product } from 'src/models/product.model';
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';
import { Brand } from 'src/models/brand.model';
import { User } from 'src/models/user.model';
import { ProductFavourite } from 'src/models/productFavourite.model';
import { Ioro } from 'src/models/ioro.model';
import { MedRec } from 'src/models/medRec.model';
import { Strain } from 'src/models/strain.model';
const fs = require("fs");

@Injectable()
export class FavouritesService {

  constructor(
      @InjectModel(Product)
      private productModel: typeof Product,
      @InjectModel(ProductFavourite)
      private productFavouriteModel: typeof ProductFavourite,
  ) { }

  async handleFavourites(jwtUserDTO: JwtUserDTO, slug: string){
    const product = await this.productModel.findOne({
      where: { slug: slug }
    })
    if(!product) throw new BadRequestException('Product Not Found');
    let response;
    const existingProduct = await this.productFavouriteModel.findOne({
      where: { userId: jwtUserDTO.id, productId: product.id },
      paranoid: false
    })
    if(!existingProduct){
      const favourite = await this.productFavouriteModel.create({
        userId: jwtUserDTO.id,
        productId: product.id
      }).then(async function(item){
        response = {
          status: true,
          message: 'Product Added to Favourite'
        };
      }).catch(function (err) {
        response = {
          status: false,
          message: 'Something went wrong'
        };
      });
    } else {
      if(existingProduct.deletedAt){
        existingProduct.restore()
        response = {
          status: true,
          message: 'Product Added to Favourite'
        };
      } else {
        existingProduct.destroy();
        response = {
          status: true,
          message: 'Product Removed from Favourite'
        };
      }
    }
    return response;
  }

  async myFavourites(jwtUserDTO: JwtUserDTO, offset: number = 0, limit: number = 10){
    const { count, rows: favouriteProducts } = await this.productFavouriteModel.findAndCountAll({
      include: [
        {model: Product,
          include: [
            { model: User, 
              include: [Brand]
            },
            MedRec, 
            Strain, 
            Ioro,
            Category
          ],
          where: { isActive: 1 }
        },
      ],
      where: {
        userId: jwtUserDTO.id
      },
      offset: offset ? offset * limit : 0,
      limit: limit
    })
    return {
      count: count,
      currentPage: offset ? +offset : 0,
      totalPages: Math.ceil(count / limit),
      favouriteProducts: favouriteProducts,
    };
  }
}