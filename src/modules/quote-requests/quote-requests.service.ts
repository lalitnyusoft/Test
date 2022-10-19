import { Injectable, NotFoundException, UnprocessableEntityException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { Brand } from 'src/models/brand.model';
import { Product } from 'src/models/product.model';
import { ProductQuote } from 'src/models/productQuote.model';
import { ProductQuoteItem } from 'src/models/productQuoteItem.model';
import { User } from 'src/models/user.model';
import { HelperService } from 'src/services/Helper.service';
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';
const { FRONEND_BASE_URL } = process.env;

@Injectable()
export class QuoteRequestsService {
  constructor(
    @InjectModel(ProductQuote)
    private productQuoteModel: typeof ProductQuote,
    @InjectModel(ProductQuoteItem)
    private productQuoteItemModel: typeof ProductQuoteItem,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Product)
    private productModel: typeof Product,
    private mailService?: MailServiceService,
  ) { }

  async getQuoteRequests(jwtUserDTO: JwtUserDTO, sortBy: string, offset: number = 0, limit: number = 10) {
    const user = await this.userModel.findOne({
      include: [Brand],
      where: {
        id: jwtUserDTO.id
      }
    })
    if (!user || +user.role === 3) throw new NotFoundException();
    let dynamicSort = 'desc';
    if (sortBy && ['asc', 'desc'].includes(sortBy)) {
      dynamicSort = sortBy
    }
    const { count, rows: quoteRequests } = await this.productQuoteModel.findAndCountAll({
      include: [User, ProductQuoteItem],
      where: {
        brandId: user.brand.id
      },
      order: [
        ['createdAt', dynamicSort],
      ],
      offset: offset ? offset * limit : 0,
      limit: limit
    });
    return {
      count: count,
      currentPage: offset ? +offset : 0,
      totalPages: Math.ceil(count / limit),
      quoteRequests: quoteRequests,
    };
  }

  async getRequestedQuotes(jwtUserDTO: JwtUserDTO, sortBy: string, offset: number = 0, limit: number = 10) {
    const user = await this.userModel.findOne({
      where: {
        id: jwtUserDTO.id
      }
    })
    if (!user || +user.role === 2) throw new NotFoundException();
    let dynamicSort = 'desc';
    if (sortBy && ['asc', 'desc'].includes(sortBy)) {
      dynamicSort = sortBy
    }
    const { count, rows: requestedQuotes } = await this.productQuoteModel.findAndCountAll({
      include: [Brand],
      where: {
        retailerId: user.id
      },
      order: [
        ['createdAt', dynamicSort],
      ],
      offset: offset ? offset * limit : 0,
      limit: limit
    });
    return {
      count: count,
      currentPage: offset ? +offset : 0,
      totalPages: Math.ceil(count / limit),
      requestedQuotes: requestedQuotes,
    };
  }

  async getQuoteRequestData(jwtUserDTO: JwtUserDTO, quoteId: string) {
    const quoteData = await this.productQuoteModel.findOne({
      include: [
        User,
        Brand,
        {
          model: ProductQuoteItem,
          include: [Product]
        }],
      where: {
        quoteId: quoteId
      }
    });
    if (!quoteData) throw new NotFoundException();
    return quoteData;
  }

  async submitProductsPrice(jwtUserDTO: JwtUserDTO, productsPrice: any) {
    const user = await this.userModel.findOne({
      include: [Brand],
      where: {
        id: jwtUserDTO.id
      }
    })
    if (!user) throw new NotFoundException();
    var productsLength = Object.keys(productsPrice).length;
    const hasEmptyFieldLength = Object.values(productsPrice).filter((item) => item === '').length;
    if (productsLength && !hasEmptyFieldLength) {
      for (const quoteItemId in productsPrice) {
        const quoteItem = await this.productQuoteItemModel.findOne({
          where: {
            id: quoteItemId
          }
        });
        const product = await this.productModel.findOne({
          where: {
            id: quoteItem.productId
          }
        });
        if (!product) throw new NotFoundException('Product not found');
        if (product.brandId !== user.brand.id) {
          throw new NotFoundException();
        }
        quoteItem.update({
          price: productsPrice[quoteItemId]
        });
        // if (!--productsLength) {
        await this.productQuoteModel.update({
          status: 2
        },
          {
            where: {
              id: quoteItem.productQuoteId
            }
          })
        // }
      }
      return true;
    } else {
      return false;
    }
  }

  async cancelQuote(jwtUserDTO: JwtUserDTO, quoteId: string) {
    const user = await this.userModel.findOne({
      where: {
        id: jwtUserDTO.id
      }
    })
    if (!user) throw new NotFoundException();
    const quote = await this.productQuoteModel.findOne({
      include: [
        {
          model: Brand,
          include: [User]
        },
        User
      ],
      where: {
        id: quoteId,
        retailerId: user.id
      }
    });
    if (!quote) throw new NotFoundException('Quote not found');
    await this.productQuoteModel.update(
      {
        status: 3
      },
      {
        where: {
        id: quoteId,
        }
      }
    )
    
    const helperService = new HelperService();
    const retailerData = {
      'QUOTE_ID': '#'+quote.quoteId,  
      'TITLE': 'You have cancelled the quote',
      'QUOTEID': '#'+quote.quoteId,
      'BRAND': quote.brand ? quote.brand.brandName : 'N/A',
      'LINK': FRONEND_BASE_URL+'/requested-quotes/'+quote.quoteId
    };
    const retailerEmailContent = await helperService.emailTemplateContent(20, retailerData)
    this.mailService.sendMail(quote.retailer.email, retailerEmailContent.subject, retailerEmailContent.body);

    const brandData = {
      'QUOTE_ID': '#'+quote.quoteId,
      'TITLE': 'Quote has been cancelled',
      'QUOTEID': '#'+quote.quoteId,
      'CUSTOMER': quote.retailer ? quote.retailer.fullName : 'N/A',
      'LINK': FRONEND_BASE_URL+'/quote-requests/'+quote.quoteId
    };
    const brandEmailContent = await helperService.emailTemplateContent(21, brandData)
    this.mailService.sendMail(quote.brand.user.email, brandEmailContent.subject, brandEmailContent.body);
    return true;
  }
}
