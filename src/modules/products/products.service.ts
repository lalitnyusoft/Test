import { Review } from 'src/models/review.model';
import { BadRequestException, ForbiddenException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from 'src/models/category.model';
import { Ioro } from 'src/models/ioro.model';
import { MedRec } from 'src/models/medRec.model';
import { Product } from 'src/models/product.model';
import { ProductImages } from 'src/models/productImages.model';
import { Strain } from 'src/models/strain.model';
import { User } from 'src/models/user.model';
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Op, where, fn, col } from 'sequelize';
import { Order } from 'src/models/order.model';
import { HelperService } from 'src/services/Helper.service';
import { Brand } from 'src/models/brand.model';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { ProductFavourite } from 'src/models/productFavourite.model';
import { Sequelize } from 'sequelize-typescript';
import { ProductPriceHistory } from 'src/models/productPriceHistory.model';
import { QuickUpdateProductDto } from './dto/quick-update-product.dto';
import { ProductQuote } from 'src/models/productQuote.model';
const fs = require("fs");
const { FRONEND_BASE_URL } = process.env;
const moment = require('moment');
@Injectable()
export class ProductsService {

  constructor(
    @InjectModel(Product)
    private productModel: typeof Product,
    @InjectModel(ProductImages)
    private productImagesModel: typeof ProductImages,
    // @InjectModel(ProductPriceHistory)
    // private productPriceHistoryModel: typeof ProductPriceHistory,
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Order)
    private orderModel: typeof Order,
    @InjectModel(Brand)
    private brandModel: typeof Brand,
    @InjectModel(ProductQuote)
    private productQuoteModel: typeof ProductQuote,
    private mailService?: MailServiceService,
  ) { }

  async addProductImages(createArray: any) {
    await this.productImagesModel.create(createArray);
  }


  async addProduct(createProductDto: CreateProductDto, jwtUserDTO: JwtUserDTO, labResults) {
    let slug = createProductDto.title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const existProductWithSlug = await this.productModel.findAndCountAll({
      where: {
        slug: {
          [Op.like]: `%${slug}%`
        }
      },
    });
    if (existProductWithSlug.count) {
      slug = slug + '-' + existProductWithSlug.count;
    }
    const brand = await this.brandModel.findOne({
      where: {
        userId: jwtUserDTO.id
      }
    })
    if (!brand) throw new BadRequestException('Something went wrong');
    const product = await this.productModel.create({
      userId: jwtUserDTO.id,
      brandId: brand.id,
      title: createProductDto.title,
      slug: slug,
      categoryId: createProductDto.categoryId,
      medRecId: createProductDto.medRecId,
      //price: createProductDto.price,
      strainId: createProductDto.strainId,
      dominant: createProductDto.dominant,
      iOId: createProductDto.iOId,
      harvested: createProductDto.harvested,
      thc: createProductDto.thc,
      flavor: createProductDto.flavor,
      description: createProductDto.description,
      labResultsPath: labResults.filename
    });

    if (createProductDto.productImages) {
      let productImages = createProductDto.productImages;
      if (typeof productImages === 'string') {
        await this.addProductImages({
          productId: product.id,
          image: JSON.parse(productImages),
        });
      } else {
        Promise.all(
          productImages.map(async (imagePath) => {
            if (imagePath) {
              await this.addProductImages({
                productId: product.id,
                image: JSON.parse(imagePath),
              });
            }
          }),
        );
      }
    }

    // await this.productPriceHistoryModel.create({
    //   productId: product.id,
    //   price: createProductDto.price,
    // });

    return product != null;
  }

  async uploadProductImage(file) {
    return file.filename
  }

  async removeProductImage(filePath: any) {
    const image = await this.productImagesModel.findOne({
      where: { image: filePath }
    });
    if (image) {
      await this.productImagesModel.destroy({
        where: { image: filePath }
      });
    }
    if (fs.existsSync('../assets' + filePath)) {
      return fs.unlinkSync('../assets' + filePath)
    } else {
      throw new NotFoundException()
    }
  }

  async updateProduct(slug: string, updateProductDto: UpdateProductDto, jwtUserDTO: JwtUserDTO, labResults) {
    const product = await this.checkExist(slug);
    const labResultDocumentPath = await labResults ? labResults.filename : updateProductDto.labResultsPath ? updateProductDto.labResultsPath : null;

    if (labResults && fs.existsSync('../assets' + product.labResultsPath)) {
          fs.unlink('../assets' + product.labResultsPath, (err) => {
              if (err) {
                  return;
              }
          })
      }
    // if (+product.price !== +updateProductDto.price) {
    //   const date = await moment().format("YYYY-MM-DD");
      // const productPriceHistory = await this.productPriceHistoryModel.findOne({
      //   where: {
      //     productId: product.id,
      //     [Op.and]: [
      //       Sequelize.where(Sequelize.fn('date', Sequelize.col('createdAt')), '=', date)
      //     ]
      //   }
      // });
      // if (!productPriceHistory) {
      //   await this.productPriceHistoryModel.create({
      //     productId: product.id,
      //     price: updateProductDto.price,
      //   });
      // } else {
      //   productPriceHistory.update({
      //     price: updateProductDto.price,
      //   });
    //   }
    // }

    product.update({
      userId: jwtUserDTO.id,
      title: updateProductDto.title,
      categoryId: updateProductDto.categoryId,
      medRecId: updateProductDto.medRecId,
      //price: updateProductDto.price,
      strainId: updateProductDto.strainId,
      dominant: updateProductDto.dominant,
      iOId: updateProductDto.iOId,
      harvested: updateProductDto.harvested,
      thc: updateProductDto.thc,
      flavor: updateProductDto.flavor,
      description: updateProductDto.description,
      labResultsPath: labResultDocumentPath
    });

    if (updateProductDto.productImages) {
      const productImages = updateProductDto.productImages;
      if (typeof productImages === 'string') {
        await this.addProductImages({
          productId: product.id,
          image: JSON.parse(productImages),
        });
      } else {
        Promise.all(
          productImages.map(async (imagePath) => {
            if (imagePath) {
              await this.addProductImages({
                productId: product.id,
                image: JSON.parse(imagePath),
              });
            }
          }),
        );
      }
    }

    return product != null;
  }

  async quickUpdateProduct(slug: string, quickUpdateProductDto: QuickUpdateProductDto, jwtUserDTO: JwtUserDTO) {
    const product = await this.productModel.findOne({
      include: [
        Category,
        MedRec,
        Strain,
        Ioro
      ],
      where: { slug: slug },
    });
    if (!product) throw new NotFoundException('Product Not Found');
    await product.update({
      userId: jwtUserDTO.id,
      title: quickUpdateProductDto.title,
      categoryId: quickUpdateProductDto.categoryId,
      medRecId: quickUpdateProductDto.medRecId,
      //price: quickUpdateProductDto.price,
      strainId: quickUpdateProductDto.strainId,
      dominant: quickUpdateProductDto.dominant,
      iOId: quickUpdateProductDto.iOId,
      harvested: quickUpdateProductDto.harvested,
      thc: quickUpdateProductDto.thc,
      flavor: quickUpdateProductDto.flavor,
    });
    await product.reload();
    return product;
  }

  async findAllProduct() {
    const allProducts = await this.productModel.findAll();
    return allProducts;
  }

  async findOne(jwtUserDTO: JwtUserDTO, slug: string) {
    const startedDate = await moment().subtract(1, 'month').toDate();
    const endDate = await moment().add(1, 'day').toDate();
    if (jwtUserDTO) {
      const user = await this.userModel.findOne({
        where: {
          id: jwtUserDTO.id
        }
      });
      if (!user) throw new NotFoundException();
      let whereCondition = {};
      if (+user.role === 3) {
        whereCondition = {
          ...whereCondition, isActive: 1
        }
      }
      const product = await this.productModel.findOne({
        include: [
          this.productImagesModel,
          MedRec,
          Strain,
          { model: ProductFavourite, where: { userId: jwtUserDTO.id }, required: false },
          Ioro,
          Category,
          {
            model: this.userModel, include: [this.brandModel]
          },
          {
            model: ProductPriceHistory,
            where: {
              createdAt: { [Op.between]: [startedDate, endDate] }
            },
            attributes: [
              'price',
              'createdAt'
            ],
            required: false
          },
        ],
        where: { slug, ...whereCondition },
        order: [
          [{ model: ProductPriceHistory, as: 'productPriceHistory' }, 'createdAt', 'asc']
        ]
      });
      if (!product) throw new NotFoundException('The product has been deactivated');
      let productData = product.toJSON();
      const productOrder = await Order.findAll({
        attributes: [
          [Sequelize.fn('IFNULL', Sequelize.fn('sum', Sequelize.col('quantity')), 0), 'totalUnitSold'],
        ],
        where: {
          status: 6,
          isActive: 1,
          productId:productData.id
        },
      });
      let productOrderData = productOrder[0].toJSON();
      productData.totalUnitSold = productOrderData.totalUnitSold;
      if (jwtUserDTO) {
        if (product.user.stateId !== user.stateId) {
          productData.canOrder = false
        } else {
          productData.canOrder = true
        }
      }
      return productData;
    } else {
      const product = await this.productModel.findOne({
        logging:console.log,
        include: [
          this.productImagesModel,
          MedRec,
          Strain,
          Ioro,
          Category,
          {
            model: this.userModel, include: [this.brandModel]
          },
          {
            model: ProductPriceHistory,
            where: {
              createdAt: { [Op.between]: [startedDate, endDate] }
            },
            attributes: [
              'price',
              'createdAt'
            ],
            required: false
          },
        ],
        where: { slug, isActive: 1 },
        order: [
          [{ model: ProductPriceHistory, as: 'productPriceHistory' }, 'createdAt', 'asc']
        ]
      });
      if (!product) throw new NotFoundException();
      let productData = product.toJSON();
      const productOrder = await Order.findAll({
        attributes: [
          [Sequelize.fn('IFNULL', Sequelize.fn('sum', Sequelize.col('quantity')), 0), 'totalUnitSold'],
        ],
        where: {
          status: 6,
          isActive: 1,
          productId:productData.id
        },
      });
      let productOrderData = productOrder[0].toJSON();
      productData.totalUnitSold = productOrderData.totalUnitSold;
      productData.canOrder = false
      return productData;
    }
  }

  async findProduct(slug: string) {
    const startedDate = await moment().subtract(1, 'month').toDate();
    const endDate = await moment().add(1, 'day').toDate();
    const product = await this.productModel.findOne({
      include: [
        this.productImagesModel,
        MedRec,
        Strain,
        Ioro,
        Category,
        {
          model: this.userModel, include: [this.brandModel]
        },
        {
          model: ProductPriceHistory,
          where: {
            createdAt: { [Op.between]: [startedDate, endDate] }
          },
          attributes: [
            'price',
            'createdAt'
          ],
          required: false
        },
      ],
      where: { slug, isActive: 1 },
      order: [
        [{ model: ProductPriceHistory, as: 'productPriceHistory' }, 'createdAt', 'asc']
      ]
    });
    if (!product) throw new NotFoundException();
    let productData = product.toJSON();
    const productOrder = await Order.findAll({
      attributes: [
        [Sequelize.fn('IFNULL', Sequelize.fn('sum', Sequelize.col('quantity')), 0), 'totalUnitSold'],
      ],
      where: {
        status: 6,
        isActive: 1,
        productId:productData.id
      },
    });
    let productOrderData = productOrder[0].toJSON();
    productData.totalUnitSold = productOrderData.totalUnitSold;
    productData.canOrder = false
    return productData;
  }

  async deleteProduct(slug: string) {
    const existProduct = await this.checkExist(slug)
    const product = await this.productModel.destroy({
      where: { id: existProduct.id },
      cascade: true
    })
    await this.productImagesModel.destroy({
      where: { productId: existProduct.id }
    })
    return product;
  }

  async checkExist(slug: string) {
    const product = await this.productModel.findOne({
      include: [Category],
      where: { slug: slug },
    });
    if (!product) throw new NotFoundException('Product Not Found');
    return product;
  }

  async getMyProducts(jwtUserDTO: JwtUserDTO, category: string, sortBy: string, keyword: string, offset: number = 0, limit: number = 10) {
    let optionalFilter = {};
    let dynamicSort = 'desc';
    if (sortBy && ['asc', 'desc'].includes(sortBy)) {
      dynamicSort = sortBy
    }
    if (category) {
      optionalFilter = { ...optionalFilter, categoryId: category }
    }
    if (keyword) {
      optionalFilter = { ...optionalFilter, title: { [Op.like]: `%${keyword}%` } }
    }
    const { count, rows: product } = await this.productModel.findAndCountAll({
      include: [
        Category,
        MedRec,
        Strain,
        Ioro
      ],
      where: {
        [Op.and]: [
          { userId: jwtUserDTO.id }
        ],
        ...optionalFilter
      },
      order: [
        ['createdAt', dynamicSort],
      ],
      offset: offset ? offset * limit : 0,
      limit: limit
    })
    return {
      count: count,
      currentPage: offset ? +offset : 0,
      totalPages: Math.ceil(count / limit),
      product: product,
    };
  }

  async requestOrder(jwtUserDTO: JwtUserDTO, productData: any, productQuoteId: number) {
    for (const productQuoteItem of productData) { 
      const product = await this.productModel.findOne({
        include: [Category],
        where: { id: productQuoteItem['productId'] },
      });
      if (!product) throw new NotFoundException('Product Not Found');
      const brand = await this.brandModel.findOne({
        include: [User],
        where: { userId: product.userId }
      });
      const retailer = await this.userModel.findOne({
        where: { id: jwtUserDTO.id }
      });
      if (!retailer) throw new NotFoundException('Retailer Not Found');
      // if(brand.user.stateId !== retailer.stateId){
      //   throw new ForbiddenException('You can order products from seller who is in your state only');
      // }
      if (+productQuoteItem['quantity'] < 1) {
        throw new BadRequestException('Please enter valid quantity of product');
      } else if (productQuoteItem['quantity'] === '' || productQuoteItem['quantity'] === undefined) {
        throw new BadRequestException('Quantity should not be empty');
      }
      const order = await this.orderModel.create({
        brandId: brand.id,
        retailerId: jwtUserDTO.id,
        productId: product.id,
        categoryId: product.categoryId,
        quantity: +productQuoteItem['quantity'],
        amount: productQuoteItem['price'],
        total: productQuoteItem['price']*productQuoteItem['quantity'],
        status: 1,
      });
      order.update({ orderId: 'ORD' + String(order.id).padStart(8, '0') });
      this.productQuoteModel.destroy({
        where: {
          id: productQuoteId
        }
      })
      const helperService = new HelperService();
      const retailerData = {
        'ORDER_ID': '#' + order.orderId,
        'TITLE': 'Your Order Has Been Placed',
        'ORDERID': '#' + order.orderId,
        'PRODUCT': product.title,
        'CATEGORY': product.category ? product.category.title : 'N/A',
        'BRAND': brand.brandName,
        'QUANTITY': order.quantity,
        'PRICE': order.amount,
        'TOTAL': order.totalPrice,
        'LINK': FRONEND_BASE_URL + '/my-orders'
      };
      const retailerEmailContent = await helperService.emailTemplateContent(7, retailerData)
      this.mailService.sendMail(jwtUserDTO.email, retailerEmailContent.subject, retailerEmailContent.body);

      const brandData = {
        'ORDER_ID': '#' + order.orderId,
        'TITLE': 'New Order, Please Find Below Details Of Order',
        'ORDERID': '#' + order.orderId,
        'PRODUCT': product.title,
        'CATEGORY': product.category ? product.category.title : 'N/A',
        'CUSTOMER': retailer.fullName,
        'QUANTITY': order.quantity,
        'PRICE': order.amount,
        'TOTAL': order.totalPrice,
        'LINK': FRONEND_BASE_URL + '/orders'
      };
      const brandEmailContent = await helperService.emailTemplateContent(8, brandData)
      this.mailService.sendMail(brand.user.email, brandEmailContent.subject, brandEmailContent.body);
    }
    return true;
  }

  async getAllProduct(jwtUserDTO: JwtUserDTO, offset: number = 0, limit: number = 10, orderBy?: string, keyword?: string, category?: string, medRec?: string, priceMin?: number, priceMax?: number, thcMin?: number, thcMax?: number, strain?: string, io?: string) {
    let orderByTitle = 'asc';
    let orderByField = 'createdAt';
    let optionalFilter = {};
    if (orderBy) {
      orderByTitle = orderBy;
    } else {
      orderByTitle = 'desc'
    }
    if (keyword) {
      optionalFilter = { ...optionalFilter, title: { [Op.like]: `%${keyword}%` } }
    }
    if (category) {
      optionalFilter = { ...optionalFilter, categoryId: category }
    }
    // if (medRec) {
    //   optionalFilter = { ...optionalFilter, medRecId: medRec }
    // }

    if (priceMax) {
      optionalFilter = {
        ...optionalFilter, price: {
          [Op.between]: [priceMin, priceMax],
        },
      }
    }
    if (thcMax) {
      optionalFilter = {
        ...optionalFilter, thc: {
          [Op.between]: [thcMin, thcMax],
        },
      }
      //optionalFilter = { ...optionalFilter, thc: thc }
    }
    if (strain) {
      optionalFilter = { ...optionalFilter, strainId: strain }
    }
    if (io) {
      optionalFilter = { ...optionalFilter, iOId: io }
    }
    const user = await this.userModel.findOne({
      where: {
        id: jwtUserDTO.id
      }
    });
    const { count, rows: products } = await this.productModel.findAndCountAll({
      include: [
        {
          model: this.userModel,
          include: [this.brandModel],
        },
        Category,
        // MedRec,
        Strain,
        Ioro,
        { model: ProductFavourite, where: { userId: jwtUserDTO.id }, required: false }
      ],
      where: {
        [Op.and]: [
          { isActive: '1' },
        ],
        medRecId: user.medRecId,
        ...optionalFilter
      },
      order: [
        [orderByField, orderByTitle],
      ],
      offset: offset ? offset * limit : 0,
      limit: limit
    })

    const maxValue = await this.productModel.findOne(
      {
        attributes: [[Sequelize.fn('max', Sequelize.col('price')), 'price'], [Sequelize.fn('max', Sequelize.col('thc')), 'thc']],
        where: {
          isActive: 1
        }
      })
    // const thc = await this.productModel.findOne(
    //   {
    //     attributes: [[Sequelize.fn('max', Sequelize.col('price')), 'max']],
    //   })

    return {
      count: count,
      currentPage: offset ? +offset : 0,
      totalPages: Math.ceil(count / limit),
      maxValue,
      products: products,
    };
  }

  async changeProductStatus(slug: string) {
    const existProduct = await this.checkExist(slug)
    const updatedProduct = await existProduct.update({
      isActive: +existProduct.isActive === 1 ? '2' : '1'
    })
    return updatedProduct;
  }

  async productReview(slug?: string, page?: string, perPage?: string) {
    const { count, rows: productReviews } = await Review.findAndCountAll({
      where: { type: 1 },
      order: [
        ['id', 'desc']
      ],
      offset: page ? parseInt(page) * parseInt(perPage) : 0,
      limit: parseInt(perPage),
      include: [{ model: Product, where: { slug: slug } }, this.userModel]
    })
    return { count, productReviews }
  }
}
