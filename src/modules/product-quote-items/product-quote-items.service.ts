import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { ProductQuoteItem } from 'src/models/productQuoteItem.model';

@Injectable()
export class ProductQuoteItemsService {
  constructor(
      @InjectModel(ProductQuoteItem)
      private productQuoteItemModel: typeof ProductQuoteItem
  ) { }

}
