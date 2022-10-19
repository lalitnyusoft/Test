import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { QuoteRequestsController } from './quote-requests.controller';
import { QuoteRequestsService } from './quote-requests.service';
import { ProductQuote } from 'src/models/productQuote.model';
import { User } from 'src/models/user.model';
import { ProductQuoteItem } from 'src/models/productQuoteItem.model';
import { Brand } from 'src/models/brand.model';
import { Product } from 'src/models/product.model';
import { MailServiceService } from 'src/mail-service/mail-service.service';

@Module({
  imports: [
    SequelizeModule.forFeature([
      ProductQuote, User, ProductQuoteItem, Brand, Product
    ])
  ],
  controllers: [QuoteRequestsController],
  providers: [QuoteRequestsService, MailServiceService]
})
export class QuoteRequestsModule { }
