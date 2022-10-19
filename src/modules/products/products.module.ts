import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsController } from './products.controller';
import { Product } from 'src/models/product.model';
import { ProductImages } from 'src/models/productImages.model';
import { User } from 'src/models/user.model';
import { Order } from 'src/models/order.model';
import { Brand } from 'src/models/brand.model';
import { ProductPriceHistory } from 'src/models/productPriceHistory.model';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { ProductQuote } from 'src/models/productQuote.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Product, ProductImages, User, Order, Brand, ProductPriceHistory, ProductQuote
    ])
  ],
  controllers: [ProductsController],
  providers: [ProductsService, MailServiceService]
})
export class ProductsModule {}
