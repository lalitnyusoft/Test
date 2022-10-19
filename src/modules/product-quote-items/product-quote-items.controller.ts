import { Controller } from '@nestjs/common';
import { ProductQuoteItemsService } from './product-quote-items.service';


@Controller()
export class ProductQuoteItemsController {
  constructor(private readonly productsQuotesService: ProductQuoteItemsService) {}
}
