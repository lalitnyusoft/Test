import {
  AutoIncrement,
  BelongsTo,
  Column,
  ForeignKey,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { Brand } from './brand.model';
import { Product } from './product.model';
import { User } from './user.model';

@Table({
  tableName: 'cart',
})
export class Cart extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @ForeignKey(() => User)
  @Column
  retailerId: number;

  @ForeignKey(() => User)
  @Column
  brandId: number;

  @ForeignKey(() => Product)
  @Column
  productId: number;

  @Column
  quantity: number;

  @BelongsTo(() => User, 'retailerId')
  retailer: User;

  @BelongsTo(() => Brand, 'brandId')
  brand: Brand;

  @BelongsTo(() => Product, 'productId')
  product: Product;
}