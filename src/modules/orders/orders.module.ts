import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { Product } from 'src/models/product.model';
import { ProductImages } from 'src/models/productImages.model';
import { User } from 'src/models/user.model';
import { Order } from 'src/models/order.model';
import { Brand } from 'src/models/brand.model';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { Review } from 'src/models/review.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Product, User, Order, Brand, Review
    ])
  ],
  controllers: [OrdersController],
  providers: [OrdersService, MailServiceService]
})
export class OrdersModule {}
