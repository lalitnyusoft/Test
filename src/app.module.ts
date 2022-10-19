import { BrandModule } from './modules/brand/brand.module';
import { AuthModule } from './modules/auth/auth.module';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './config/db.config';
// database
import { SequelizeModule } from '@nestjs/sequelize';

// routes
import { RouterModule } from 'nest-router';
import { routes } from './app.routes';
import { UserModule } from './modules/user/user.module';
import { ProductsModule } from './modules/products/products.module';
import { GetFileModule } from './modules/getfile/getFile.module';
// import { MailServiceService } from './mail-service/mail-service.service';
import { StatesModule } from './modules/states/states.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MedRecModule } from './modules/medrec/medrec.module';
import { StrainsModule } from './modules/strains/strains.module';
import { IOROModule } from './modules/ioro/ioro.module';
import { PlansModule } from './modules/plans/plans.module';
import { MailerModule } from '@nestjs-modules/mailer';
import { OrdersModule } from './modules/orders/orders.module';
import { FavouritesModule } from './modules/favourite/favourites.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { CmsModule } from './modules/cms/cms.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { ProductQuoteItemsModule } from './modules/product-quote-items/product-quote-items.module';
import { CartModule } from './modules/cart/cart.module';
import { QuoteRequestsModule } from './modules/quote-requests/quote-requests.module';
import { FollowersModule } from './modules/followers/followers.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
// import { AxisPointModule } from './modules/axis-point/axispoint.module';

@Module({
  imports: [
    SequelizeModule.forRoot(config),
    RouterModule.forRoutes(routes),
    UserModule,
    AuthModule,
    ProductsModule,
    BrandModule,
    GetFileModule,
    StatesModule,
    CategoriesModule,
    MedRecModule,
    StrainsModule,
    IOROModule,
    PlansModule,
    OrdersModule,
    FavouritesModule,
    MessagesModule,
    ContactUsModule,
    DashboardModule,
    CmsModule,
    SubscriptionModule,
    QuoteRequestsModule,
    ProductQuoteItemsModule,
    CartModule,
    FollowersModule,
    PostModule,
    CommentModule
    // AxisPointModule
    //MailerModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
