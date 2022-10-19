import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from 'src/models/category.model';
import { Product } from 'src/models/product.model';
import { User } from 'src/models/user.model';
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';
import { Op, Sequelize } from 'sequelize';
import { Order } from 'src/models/order.model';
import { Brand } from 'src/models/brand.model';
import { HelperService } from 'src/services/Helper.service';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { ReviewDto } from './dto/review.dto';
import { Review } from 'src/models/review.model';
import sequelize from 'sequelize';
const fs = require("fs");
const { FRONEND_BASE_URL } = process.env;
@Injectable()
export class OrdersService {

  constructor(
      @InjectModel(Product)
      private productModel: typeof Product,
      @InjectModel(User)
      private userModel: typeof User,
      @InjectModel(Order)
      private OrderModel: typeof Order,
      @InjectModel(Brand)
      private brandModel: typeof Brand,
      @InjectModel(Review)
      private reviewModel: typeof Review,
      private mailService?: MailServiceService,
  ) { }

  async retailerOrders(jwtUserDTO: JwtUserDTO, category: string, sortBy: string, keyword: string, offset: number = 0, limit: number = 10){
    let optionalFilter = {};
    let dynamicSort = 'desc';
    if (sortBy && ['asc', 'desc'].includes(sortBy)) {
      dynamicSort = sortBy
    }
    if (category) {
      optionalFilter = { ...optionalFilter, categoryId: category }
    }
    const { count, rows: orders } = await this.OrderModel.findAndCountAll({
      include: [
        Brand,
        {
          model: Product,
        },
        Category
      ],
      where: {
        retailerId: jwtUserDTO.id,
        isActive: '1',
        [Op.and]: [
          {
            [Op.or]: [
              {orderId: { [Op.like]: `%${keyword}%` }},
              {'$product.title$': { [Op.like]: `%${keyword}%` }}
            ]
          }
        ],
        ...optionalFilter
      },
      order: [
        ['id', dynamicSort],
      ],
      offset: offset ? offset * limit : 0,
      limit: limit
    })
    return {
      count: count,
      currentPage: offset ? +offset : 0,
      totalPages: Math.ceil(count / limit),
      orders: orders,
    };
  }

  async sellerOrders(jwtUserDTO: JwtUserDTO, category: string, sortBy: string, keyword: string, offset: number = 0, limit: number = 10){
    const brand = await this.brandModel.findOne({
      where: { userId: jwtUserDTO.id }
    });
    if(!brand) throw new NotFoundException();
    let optionalFilter = {};
    let dynamicSort = 'desc';
    if (sortBy && ['asc', 'desc'].includes(sortBy)) {
      dynamicSort = sortBy
    }
    if (category) {
      optionalFilter = { ...optionalFilter, categoryId: category }
    }
    const { count, rows: orders } = await this.OrderModel.findAndCountAll({
      include: [
        User,
        {
          model: Product,
        },
        Category
      ],
      where: {
        brandId: brand.id,
        isActive: '1',
        [Op.and]: [
          {
            [Op.or]: [
              {orderId: { [Op.like]: `%${keyword}%` }},
              {'$product.title$': { [Op.like]: `%${keyword}%` }}
            ]
          }
        ],
        ...optionalFilter
      },
      order: [
        ['id', dynamicSort],
      ],
      offset: offset ? offset * limit : 0,
      limit: limit
    })
    return {
      count: count,
      currentPage: offset ? +offset : 0,
      totalPages: Math.ceil(count / limit),
      orders: orders,
    };
  }

  async updateOrders(jwtUserDTO: JwtUserDTO, orderId: string, action: string){
    const user = await this.userModel.findOne({
      include:[
        Brand
      ],
      where: {id: jwtUserDTO.id}
    })
    if(!user) throw new BadRequestException('Something went wrong');
    let columnName: string;
    let matchId: number;
    if(+user.role === 3){
      matchId = user.id;
      columnName = 'retailerId';
    } else {
      matchId = user.brand? user.brand.id : null;
      columnName = 'brandId';
    }
    const order = await this.OrderModel.findOne({
      include: [ 
        Product,
        {
          model: Brand,
          include: [User]
        },
        Category,
        User
      ],
      where: { orderId, [columnName]:  matchId }
    });
    if(!order) throw new BadRequestException('Something went wrong');
    const retailerTemplateIds = {
      'placed': 7,
      'accepted': 9,
      'cancelled': 11,
      'delivered': 13,
      'received': 15,
      'completed': 17,
    };
    const brandTemplateIds = {
      'placed': 8,
      'accepted': 10,
      'cancelled': 12,
      'delivered': 14,
      'received': 16,
      'completed': 18,
    };
    let status: string, message: string, retailerMailTitle: string, sellerMailTitle: string;
    if(action === 'accepted'){
      status = '2';
      message = "You Have Accepted The Order";
      retailerMailTitle = 'Your Order Has Been Accepeted';
      sellerMailTitle = message;
    } else if(action === 'cancelled'){
      status = '3';
      message = "You Have Cancelled The Order"
      if(+user.role === 3){
        retailerMailTitle = message;
        sellerMailTitle = 'Retailer Has Cancelled The Order';
      } else {
        retailerMailTitle = 'Brand Has Cancelled The Order';
        sellerMailTitle = message;
      }
    } else if(action === 'delivered'){
      status = '4';
      message = "The Order Status Has Been Updated To Delivered";
      retailerMailTitle = 'Your Order Has Been Delivered';
      sellerMailTitle = 'You Have Delivered The Order';
    } else if(action === 'received'){
      status = '5';
      message = "Your Order Has Been Received"
      retailerMailTitle = 'You Have Received The Order';
      sellerMailTitle = 'Your Order Has Been Received By Retailer';
    } else if(action === 'completed'){
      status = '6';
      message = "Order status has been updated to completed"
      retailerMailTitle = 'Thank You For Giving Review On Your Order';
      sellerMailTitle = 'Retailer Has Rated You For Your Order';
    }
    let responseStatus;
    let updateObj = {
      status: status,
      cancelledBy: null,
      cancelledAt: null
    }
    if(action === 'cancelled'){
      if(+user.role === 3){
        var cancelledById = user.id;
      } else {
        var cancelledById = user.brand.id;
      }
      updateObj = {...updateObj, cancelledBy: cancelledById, cancelledAt: new Date()}
    }
    const update = await order.update(updateObj).then(async function(item){
      responseStatus = {
        message,
        status: true
      }
    }).catch(function (err) {
      responseStatus = {
        err,
        status: false
      }
    });
    if(responseStatus.status){
      const helperService = new HelperService();
      const retailerData = {
        'ORDER_ID': '#'+order.orderId,  
        'TITLE': retailerMailTitle,
        'ORDERID': '#'+order.orderId,
        'PRODUCT': order.product ? order.product.title : 'N/A',
        'CATEGORY': order.category ? order.category.title : 'N/A',
        'BRAND': order.brand ? order.brand.brandName : 'N/A',
        'QUANTITY': order.quantity,
        'PRICE': order.product ? order.product.productPrice : 'N/A',
        'TOTAL': order.totalPrice,
        'LINK': FRONEND_BASE_URL+'/my-orders'
      };
      const retailerEmailContent = await helperService.emailTemplateContent(retailerTemplateIds[action], retailerData)
      this.mailService.sendMail(order.retailer.email, retailerEmailContent.subject, retailerEmailContent.body);

      const brandData = {
        'ORDER_ID': '#'+order.orderId,
        'TITLE': sellerMailTitle,
        'ORDERID': '#'+order.orderId,
        'PRODUCT': order.product ? order.product.title : 'N/A',
        'CATEGORY': order.category ? order.category.title : 'N/A',
        'CUSTOMER': order.retailer ? order.retailer.fullName : 'N/A',
        'QUANTITY': order.quantity,
        'PRICE': order.product ? order.product.productPrice : 'N/A',
        'TOTAL': order.totalPrice,
        'LINK': FRONEND_BASE_URL+'/orders'
      };
      const brandEmailContent = await helperService.emailTemplateContent(brandTemplateIds[action], brandData)
      this.mailService.sendMail(order.brand.user.email, brandEmailContent.subject, brandEmailContent.body);
    }
    return responseStatus;
  }

  async postReview(jwtUserDTO: JwtUserDTO, orderId: string, reviewDto: ReviewDto){
    const user = await this.userModel.findOne({
      include:[
        Brand
      ],
      where: {id: jwtUserDTO.id}
    })
    if(!user) throw new BadRequestException('Something went wrong');

    const order = await this.OrderModel.findOne({
      include: [ 
        Product,
        {
          model: Brand,
          include: [User]
        },
        Category,
        User
      ],
      where: { orderId, retailerId: user.id }
    });
    if(!order) throw new BadRequestException('Something went wrong');
    const reviewData = {
      'product': {
        type: 1,
        ratings: reviewDto.quality_rating,
        description: reviewDto.quality_review
      },
      'dot': {
        type: 2,
        ratings: reviewDto.dot_rating,
        description: reviewDto.dot_review
      },
      'general': {
        type: 3,
        ratings: reviewDto.general_rating,
        description: reviewDto.general_review
      }
    }
    for (const key in reviewData) {
      if (Object.prototype.hasOwnProperty.call(reviewData, key)) {
        const element = reviewData[key];
        const review = await this.reviewModel.create({
          productId: order.productId,
          brandId: order.brandId,
          retailerId: order.retailerId,
          ...element
        })
      }
    }
    await order.update({
      status: 6
    });

    const totalProductReviews = await this.reviewModel.count({
      where: {
        productId: order.productId,
        type: 1
      },
    });

    const productRatingsSum = await this.reviewModel.sum('ratings', {
      where: {
        productId: order.productId,
        type: 1
      }
    });
    const avgRating = productRatingsSum/totalProductReviews;
    await this.productModel.update({
      avgProductRating: avgRating,
      reviewsProductCount: totalProductReviews
    },
    {
      where: { id: order.productId }
    });

    const productQualityReviewsCount = await this.reviewModel.count({
      where: {
        brandId: order.brandId,
        type: 1
      },
    });

    const productQualityReviewsSum = await this.reviewModel.sum('ratings', {
      where: {
        brandId: order.brandId,
        type: 1
      }
    });
    const productQualityReviewsAvg = productQualityReviewsSum/productQualityReviewsCount;

    const dotCount = await this.reviewModel.count({
      where: {
        brandId: order.brandId,
        type: 2
      },
    });

    const dotSum = await this.reviewModel.sum('ratings', {
      where: {
        brandId: order.brandId,
        type: 2
      }
    });
    const dotAvg = dotSum/dotCount;

    const generalCount = await this.reviewModel.count({
      where: {
        brandId: order.brandId,
        type: 3
      },
    });

    const generalSum = await this.reviewModel.sum('ratings', {
      where: {
        brandId: order.brandId,
        type: 3
      }
    });
    const generalAvg = generalSum/generalCount;
    await this.brandModel.update({
      avgProductRating: productQualityReviewsAvg,
      reviewsProductCount: productQualityReviewsCount,
      avgDOTRating: dotAvg,
      reviewsDOTCount: dotCount,
      avgGeneralRating: generalAvg,
      reviewsGeneralCount: generalCount,
      avgRating: productQualityReviewsAvg+dotAvg+generalAvg
    },
    {
      where: { id: order.brandId}
    });
    return true;
  }
}