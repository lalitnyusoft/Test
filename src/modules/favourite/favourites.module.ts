import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { FavouritesService } from './favourites.service';
import { FavouritesController } from './favourites.controller';
import { Product } from 'src/models/product.model';
import { User } from 'src/models/user.model';
import { ProductFavourite } from 'src/models/productFavourite.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductFavourite, Product, User
    ])
  ],
  controllers: [FavouritesController],
  providers: [FavouritesService]
})
export class FavouritesModule {}
