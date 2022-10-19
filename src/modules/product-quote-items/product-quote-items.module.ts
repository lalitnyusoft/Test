import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { ProductQuoteItem } from 'src/models/productQuoteItem.model';
import { ProductQuoteItemsController } from './product-quote-items.controller';
import { ProductQuoteItemsService } from './product-quote-items.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductQuoteItem
    ])
  ],
  controllers: [ProductQuoteItemsController],
  providers: [ProductQuoteItemsService]
})
export class ProductQuoteItemsModule {}
