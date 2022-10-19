import { Routes } from 'nest-router';
const { API_BASE } = process.env;
require('dotenv').config();
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ProductsModule } from './modules/products/products.module';
import { BrandModule } from './modules/brand/brand.module';
import { GetFileModule } from './modules/getfile/getFile.module';
import { StatesModule } from './modules/states/states.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { MedRecModule } from './modules/medrec/medrec.module';
import { StrainsModule } from './modules/strains/strains.module';
import { IOROModule } from './modules/ioro/ioro.module';
import { PlansModule } from './modules/plans/plans.module';
import { OrdersModule } from './modules/orders/orders.module';
import { FavouritesModule } from './modules/favourite/favourites.module';
import { MessagesModule } from './modules/messages/messages.module';
import { ContactUsModule } from './modules/contact-us/contact-us.module';
import { DashboardModule } from './modules/dashboard/dashboard.module';
import { AxisPointModule } from './modules/axis-point/axispoint.module';
import { CmsModule } from './modules/cms/cms.module';
import { SubscriptionModule } from './modules/subscription/subscription.module';
import { CartModule } from './modules/cart/cart.module';
import { QuoteRequestsModule } from './modules/quote-requests/quote-requests.module';
import { FollowersModule } from './modules/followers/followers.module';
import { PostModule } from './modules/post/post.module';
import { CommentModule } from './modules/comment/comment.module';
export const routes: Routes = [
  {
    path: `${API_BASE}/user`,
    module: UserModule,
  },
  {
    path: `${API_BASE}/auth`,
    module: AuthModule,
  },
  ,
  {
    path: `${API_BASE}/product`,
    module: ProductsModule,
  },
  {
    path: `${API_BASE}/brand`,
    module: BrandModule,
  },
  {
    path: `${API_BASE}/get/file`,
    module: GetFileModule,
  },
  {
    path: `${API_BASE}/states`,
    module: StatesModule,
  },
  {
    path: `${API_BASE}/categories`,
    module: CategoriesModule,
  },
  {
    path: `${API_BASE}/medrec`,
    module: MedRecModule,
  },
  {
    path: `${API_BASE}/strains`,
    module: StrainsModule,
  },
  {
    path: `${API_BASE}/ioro`,
    module: IOROModule,
  },
  {
    path: `${API_BASE}/plan`,
    module: PlansModule,
  },
  {
    path: `${API_BASE}/cms`,
    module: CmsModule,
  },
  {
    path: `${API_BASE}/orders`,
    module: OrdersModule,
  },
  {
    path: `${API_BASE}/favourites`,
    module: FavouritesModule,
  },
  {
    path: `${API_BASE}/messages`,
    module: MessagesModule,
  },
  {
    path: `${API_BASE}/contact-us`,
    module: ContactUsModule,
  },
  {
    path: `${API_BASE}/dashboard`,
    module: DashboardModule,
  },
  {
    path: `${API_BASE}/axis-point`,
    module: AxisPointModule,
  },
  {
    path: `${API_BASE}/webhook-expired-plan`,
    module: SubscriptionModule,
  },
  {
    path: `${API_BASE}/cart`,
    module: CartModule,
  },
  {
    path: `${API_BASE}/quote-requests`,
    module: QuoteRequestsModule,
  },
  {
    path: `${API_BASE}/followers`,
    module: FollowersModule,
  },
  {
    path: `${API_BASE}/posts`,
    module: PostModule,
  },
  {
    path: `${API_BASE}/comment`,
    module: CommentModule,
  },
]