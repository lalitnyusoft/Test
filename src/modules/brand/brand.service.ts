import { EmailTemplate } from 'src/models/emailTemplate.model';
import { Review } from 'src/models/review.model';
import { Ioro } from './../../models/ioro.model';
import { Strain } from './../../models/strain.model';
import { MedRec } from 'src/models/medRec.model';
import { Product } from 'src/models/product.model';
import { UserRegisterDTO } from './../auth/dto/userRegister.dto';
import { Injectable, UnprocessableEntityException, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Brand } from 'src/models/brand.model';
import { User } from 'src/models/user.model';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { UserSubscription } from 'src/models/userSubscription.model';
import { HelperService } from 'src/services/Helper.service';
import { Settings } from 'src/models/settings.model';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { Plans } from 'src/models/plans.model';
import { State } from 'src/models/state.model';
import { Op } from 'sequelize';
import { Category } from 'src/models/category.model';
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';
import { invoiceTemplate } from "../../mail-service/templates/invoice.mail";
import { Follower } from 'src/models/follower.model';
const fs = require('fs')
var pdf = require("pdf-creator-node");
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { FRONEND_BASE_URL, ADMIN_BASE_URL } = process.env;
require('dotenv').config();
const { SITE_NAME, YEAR } = process.env;

@Injectable()
export class BrandService {
  constructor(
    @InjectModel(User)
    private userModel: typeof User,
    @InjectModel(Brand)
    private brandModel: typeof Brand,
    @InjectModel(UserSubscription)
    private userSubscriptionModel: typeof UserSubscription,
    @InjectModel(Settings)
    private settingsModel: typeof Settings,
    @InjectModel(Plans)
    private plansModel: typeof Plans,
    @InjectModel(State)
    private stateModel: typeof State,
    private mailService?: MailServiceService,
  ) { }

  async createBrand(createBrandDto: CreateBrandDto, file) {
    if (createBrandDto.password !== createBrandDto.confirmPassword) {
      throw new ForbiddenException('Password and confirm password does not match.');
    }
    const helperService = await new HelperService();
    const stripeKey = await helperService.getSettings(this.settingsModel, 'stripe_secret_key');
    let token: any;
    let stripe: any;
    let customer, plan, subscription;
    try {
      // before: sk_test_nYfuz6w9dNAu65oD9u75YKPO00rtatzOjy
      // after: sk_test_51LSIOYL7LbGWLINIc2YAGp6QSG2d9WkG0JjwdFLAWDB6Sn8mwseovg13iUXeB8Ih4ViteReEVRK8MIIpyejkERtv00DVEkcryg
      stripe = require('stripe')(stripeKey.description);
      token = await stripe.tokens.create({
        card: {
          number: createBrandDto.cardNumber, //'4242424242424242',
          exp_month: parseInt(createBrandDto.cardExpiry.slice(0, -3)), //4,
          exp_year: parseInt(createBrandDto.cardExpiry.slice(-2)), //2023,
          cvc: createBrandDto.cardCvc, //'314',
          name: createBrandDto.cardHolder
        },
      });
      customer = await stripe.customers.create({
        // name: 'Jenny Rosen',
        // address: {
        //   line1: '510 Townsend St',
        //   postal_code: '98140',
        //   city: 'San Francisco',
        //   state: 'CA',
        //   country: 'US',
        // },
        email: createBrandDto.email,
        source: token.id
      });
      plan = await this.plansModel.findOne({
        where: { id: createBrandDto.planId }
      });
      subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          { plan: plan.id },
          // { plan: 'price_1LSIr1L7LbGWLININw5A0nHr' },
        ],
      });
    }
    catch (err) {
      switch (err.type) {
        case 'StripeCardError':
          // A declined card error
          throw new BadRequestException(err.message)  // => e.g. "Your card's expiration year is invalid."
          break;
        case 'StripeRateLimitError':
          // Too many requests made to the API too quickly
          throw new BadRequestException(err.message)
          break;
        case 'StripeInvalidRequestError':
          // Invalid parameters were supplied to Stripe's API
          throw new BadRequestException(err.message)
          break;
        case 'StripeAPIError':
          throw new BadRequestException(err.message)
          // An error occurred internally with Stripe's API
          break;
        case 'StripeConnectionError':
          throw new BadRequestException(err.message)
          // Some kind of error occurred during the HTTPS communication
          break;
        case 'StripeAuthenticationError':
          throw new BadRequestException(err.message)
          // You probably used an incorrect API key
          break;
        default:
          throw new BadRequestException('Something went wrong')
          // Handle any other types of unexpected errors
          break;
      }
    }
    const checkEmail = await this.checkEmail(createBrandDto.email);
    const licenseDocumentPath = await file ? file.licenseDocument[0].filename : null;
    const profileDocumentPath = await file ? file.profileDocument ? file.profileDocument[0].filename : null : null;
    const hash = bcrypt.hashSync(createBrandDto.password, 10);
    let slug = createBrandDto.brandName.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    const existBrandWithSlug = await this.brandModel.findAndCountAll({
      where: {
        slug: {
          [Op.like]: `%${slug}%`
        }
      },
    });
    if (existBrandWithSlug.count) {
      slug = slug + '-' + existBrandWithSlug.count;
    }

    const user = await this.userModel.create({
      isApproved: 2,
      email: createBrandDto.email,
      // firstName: createBrandDto.firstName,
      businessName: createBrandDto.businessName,
      brandName: createBrandDto.brandName,
      slug: slug,
      profilePath: profileDocumentPath,
      password: hash,
      role: createBrandDto.role,
      stateId: createBrandDto.selectedState,
      zipCode: createBrandDto.zipCode,
      phoneNumber: createBrandDto.phoneNumber,
      licenseNumber: createBrandDto.licenseNumber,
      medRecId: createBrandDto.medRecId,
      expirationDate: createBrandDto.expirationDate,
      // profilePath: createBrandDto.profilePath,
      licensePath: licenseDocumentPath,
      planId: createBrandDto.planId,
      //planExpiryDate: createBrandDto.planExpiryDate,
      //subscriptionId: createBrandDto.subscriptionId,
    });
    const brand = await this.brandModel.create({
      userId: user.id,
      brandName: createBrandDto.brandName,
      slug: slug,
      website: (createBrandDto.website !== '' && createBrandDto.website !== null) ? createBrandDto.website : null,
      year: (createBrandDto.year !== '' && createBrandDto.year !== null) ? createBrandDto.year : null,
      avgOrder: (createBrandDto.avgOrder !== '' && createBrandDto.avgOrder !== null) ? createBrandDto.avgOrder : null,
      address: createBrandDto.address,
      description: createBrandDto.description,
      avgProductRating: createBrandDto.avgProductRating,
      reviewsProductCount: createBrandDto.reviewsProductCount,
      avgDOTRating: createBrandDto.avgDOTRating,
      reviewsDOTCount: createBrandDto.reviewsDOTCount,
      avgGeneralRating: createBrandDto.avgGeneralRating,
      reviewsGeneralCount: createBrandDto.reviewsGeneralCount,
      avgRating: createBrandDto.avgRating,
      // reviewsCount: createBrandDto.reviewsCount,

    })

    let startDate = await moment().format('YYYY-MM-DD'); //current Date
    let endDate = await moment().add(1, "month").format('YYYY-MM-DD'); //end date 

    const planSubscription = await this.userSubscriptionModel.create({
      userId: user.id,
      planId: plan.id,
      customerId: customer.id,
      subscriptionToken: token.id,
      subscriptionId: subscription.id,
      status: subscription.status,
      amount: '2000',
      responseJson: JSON.stringify(subscription),
      startDate: startDate,
      endDate: endDate,
      planCancelDate: ''
    })

    user.update({
      planExpiryDate: endDate, subscriptionId: planSubscription.id
    })

    const userData = {
      // 'NAME': user.firstName,
      'NAME': user.businessName,
      'LINK': FRONEND_BASE_URL + '/sign-in'
    };
    const retailerEmailContent = await helperService.emailTemplateContent(1, userData)
    this.mailService.sendMail(user.email, retailerEmailContent.subject, retailerEmailContent.body);

    const adminData = {
      // 'NAME': user.firstName,
      'NAME': user.businessName,
      'EMAIL': user.email,
      'ROLE': 'Brand',
      'LINK': ADMIN_BASE_URL + '/buyer/edit/' + user.id,
      'PLAN': plan.title
    };
    const adminEmailContent = await helperService.emailTemplateContent(6, adminData)
    const adminEmail = await helperService.getSettings(this.settingsModel, 'info_email');
    this.mailService.sendMail(adminEmail.description, adminEmailContent.subject, adminEmailContent.body);
    return user;
  }

  async findAll() {
    const brands = await this.brandModel.findAll()
    return brands
  }

  async cancelSubscription(jwtUserDTO: JwtUserDTO) {
    const activePlan = await this.userModel.findOne({
      where: { id: jwtUserDTO.id },
      attributes: ['subscriptionId']
    })

    const subscription = await this.userSubscriptionModel.findOne(
      {
        where: {
          id: activePlan.subscriptionId
        },
        attributes: ['subscriptionId']
      }
    )

    const helperService = await new HelperService();
    const stripeKey = await helperService.getSettings(this.settingsModel, 'stripe_secret_key');
    let stripe: any;

    stripe = require('stripe')(stripeKey.description);

    const deleted = await stripe.subscriptions.del(
      subscription.subscriptionId
    );
    console.log("cancel-subscription", deleted);
    const userSubscription = await this.userSubscriptionModel.update({
      planCancelDate: await moment().format('YYYY-MM-DD HH:mm:ss'),
      status: deleted.status,
      responseJson: JSON.stringify(deleted),
    }, {
      where: {
        id: activePlan.subscriptionId
      }
    })
    return userSubscription
  }

  async checkExist(id: number) {
    const user = await this.userModel.findOne({
      where: { id: id },
    });
    if (!user) throw new NotFoundException();
    return user;
  }

  async checkEmail(emailId) {
    const emailExist = await this.userModel.findOne({
      where: {
        email: emailId,
      },
    });
    if (emailExist) {
      throw new UnprocessableEntityException(
        'Email already exist, Please try another.',
      );
    }
  }

  async findSingleBrand(brandSlug: string, jwtUserDTO?: JwtUserDTO) {
    const brand = await this.brandModel.findOne({
      where: {
        slug: brandSlug,
        isActive: 1
      },
      include: [{
        model: this.userModel,
        include: [
          {
            model: this.stateModel
          },
          {
            model: Follower,
            as: 'followers',
            where: {
              isActive: 1
            },
            required: false
          },
          {
            model: Follower,
            as: 'followings',
            where: {
              isActive: 1
            },
            required: false
          }
          // {
          //   model: Product,
          //   where: {
          //     isActive: 1
          //   },
          //   include: [{ model: Category }, { model: MedRec }, { model: Strain }, { model: Ioro }],
          //   required: false
          // }
        ],
        required: false
      }]
    })
    const products = await Product.findAll({
      where: {
        isActive: 1,
        userId: brand.user.id,
      },
      include: [{ model: Category }, { model: MedRec }, { model: Strain }, { model: Ioro }],
      order: [
        ['id', 'DESC']
      ],
    })

    if (!brand) throw new NotFoundException('Brand not found');
    let brandData = brand.toJSON();
    brandData.userFollowed = false;
    brandData.canMessage = false;

    if (jwtUserDTO?.id) {
      const user = await this.userModel.findOne({
        where: {
          id: jwtUserDTO.id
        }
      })
      if (!user) throw new NotFoundException('User not found');

      if (brand.user.stateId !== user.stateId) {
        brandData.canMessage = false
      } else {
        brandData.canMessage = true
      }

      if (brand.user.id !== jwtUserDTO.id) {
        const follower = await Follower.findOne({
          where: {
            followingId: brand.user.id,
            followerId: jwtUserDTO.id,
          }
        });
        if (follower) {
          brandData.userFollowed = follower.isActive ? true : false;
        }
      }
    }
    return {
      brandData, products
    };
  }

  async subscriptionDetails(jwtUserDTO: JwtUserDTO) {
    //console.log(jwtUserDTO);
    const activePlan = await this.userModel.findOne({
      where: { id: jwtUserDTO.id },
      attributes: ['subscriptionId']
    })
    const activeSubscription = await this.userModel.findOne({
      where: { id: jwtUserDTO.id },
      include: [{
        model: this.userSubscriptionModel, where: {
          id: activePlan.subscriptionId
        }, include: [this.plansModel]
      }]
    })

    const pastSubscriptionsList
      = await this.userModel.findOne({
        where: { id: jwtUserDTO.id },
        include: [{
          model: this.userSubscriptionModel,
          // where: { id: { [Op.ne]: activePlan.subscriptionId } },
          include: [this.plansModel]
        }]
      })

    return {
      activeSubscription, pastSubscriptionsList
    };
  }

  /*   Generate invoice start  */
  async generateInvoice(jwtUserDTO: JwtUserDTO, invoiceId: number) {
    const subscriptionPlan = await this.userSubscriptionModel.findOne({
      where: { id: invoiceId },
      include: [{ model: this.userModel, include: [{ model: this.stateModel }, { model: this.brandModel }] }, {
        model: this.plansModel
      }]
    })
    if (!subscriptionPlan) throw new NotFoundException();

    // const filePath = 'src/mail-service/templates/invoice.html'
    const filePath = invoiceTemplate;
    // const htmlFile = fs.readFileSync(filePath, 'utf-8')
    // const helperService = await new HelperService();
    // const invoiceHtml = await EmailTemplate.findOne({
    //   where: { id: 19 },
    //   attributes: ['body']
    // });
    // console.log(invoiceHtml);

    const filename = 'invoice_' + Math.random() + '.pdf';
    const document = {
      html: invoiceTemplate,
      data: {
        //products: obj,
        // userName: subscriptionPlan.user.firstName ?? '',
        userName: subscriptionPlan.user.businessName ?? '',
        date: moment(subscriptionPlan.startDate).format("DD MMM 'YY"),
        // invoiceNo: 'GMX-025',
        siteName: SITE_NAME ?? '',
        toAddress: subscriptionPlan.user.brand.address ?? '',
        toState: subscriptionPlan.user.states.name ?? '',
        zipCode: subscriptionPlan.user.zipCode ?? '',
        productDetails: subscriptionPlan.plans.description ?? '',
        productTitle: subscriptionPlan.plans.title ?? '',
        productPrice: subscriptionPlan.plans.planPrice ?? '',
        totalPrice: subscriptionPlan.plans.planPrice ?? '',
        year: YEAR ?? ''
        // grandTotal: subscriptionPlan.plans.planPrice,
      },
      path: '../assets/invoice/' + filename
    }
    await pdf.create(document)
      .then(res => {
        // console.log("res", res);
      }).catch(error => {
        // console.log("error", error);
      });
    // const filepath = 'uploads/invoice/' + filename;
    return '/invoice/' + filename;
  }
  /*   Download invoice end  */

  /* seller/brand review  */

  async brandReview(slug?: string, page?: string, perPage?: string) {
    let response = { 1: '', 2: '', 3: '' };
    for await (const type of [1, 2, 3]) {
      const { count, rows: reviews } = await Review.findAndCountAll({
        where: { type: type },
        order: [
          ['id', 'desc']
        ],
        offset: page ? parseInt(page) * parseInt(perPage) : 0,
        limit: parseInt(perPage),
        include: [this.userModel, { model: this.brandModel, where: { slug: slug } }]
      })
      response[type] = { count, reviews };
    }
    return response;
  }

  async getProfile(jwtUserDTO: JwtUserDTO) {
    const brand = await this.brandModel.findOne({
      where: {
        userId: jwtUserDTO.id,
        isActive: 1
      },
      include: [{
        model: this.userModel,
        include: [{ model: this.stateModel },
        ]
      }]
    })
    const products = await Product.findAll({
      where: {
        isActive: 1,
        userId: brand.user.id,
      },
      include: [{ model: Category }, { model: MedRec }, { model: Strain }, { model: Ioro }],
      order: [
        ['id', 'DESC']
      ],
    })
    if (!brand) throw new NotFoundException('Brand not found');

    let brandData = brand.toJSON();
    return {
      brandData, products
    };
  }

}
