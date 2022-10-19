import { Product } from 'src/models/product.model';
import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    HasMany,
    ForeignKey,
    BelongsTo,
    DataType,
    HasOne,
    AllowNull,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { Brand } from './brand.model';
import { Plans } from './plans.model';
import { State } from './state.model';
import { UserSubscription } from 'src/models/userSubscription.model';
import { Review } from './review.model';
import { Order } from './order.model';
import { Message } from './message.model';
import { ProductFavourite } from './productFavourite.model';
import { MedRec } from './medRec.model';
import { Follower } from './follower.model';

@Table({
    tableName: 'users',
    // paranoid: true,
})
export class User extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`],
        }),
        defaultValue: '1',
        comment: '1 for approved, 2 for unapproved',
    })
    isApproved: number;

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`, `3`,],
        }),
        comment: '1 for admin, 2 for brand, 3 for retailer',
    })
    role: number;

    // @Column({
    //     get() {
    //         return this.getDataValue('firstName').charAt(0).toUpperCase() + this.getDataValue('firstName').slice(1);
    //     }
    // })
    // firstName: string;

    // @Column({
    //     get() {
    //         return this.getDataValue('lastName') ? this.getDataValue('lastName').charAt(0).toUpperCase() + this.getDataValue('lastName').slice(1) : null;
    //     }
    // })
    // lastName: string;

    @Column({
        get() {
            return this.getDataValue('businessName').charAt(0).toUpperCase() + this.getDataValue('businessName').slice(1);
        }
    })
    businessName: string;

    @Column({
        type: DataType.VIRTUAL
    })
    get fullName(): string {
        // return this.getDataValue('firstName')+(this.getDataValue('lastName') !== null || this.getDataValue('lastName') !== '' ? ' '+this.getDataValue('lastName') : '')
        return this.getDataValue('businessName')
    }

    @Column({
        unique: true,
    })
    slug: string;

    @AllowNull
    @Column
    brandName: string;

    @Column({
        unique: true,
    })
    email: string;

    @Column
    password: string;

    @ForeignKey(() => State)
    @Column
    stateId: number;
    @BelongsTo(() => State)
    states: State;


    @Column
    zipCode: number;

    @Column
    phoneNumber: string;

    @Column
    licenseNumber: string;

    // @Column
    // licenseType: string;

    // @ForeignKey(() => MedRec)
    // @Column
    // licenseTypeId: number;
    // @BelongsTo(() => MedRec)
    // licenseTypes: MedRec;

    @ForeignKey(() => MedRec)
    @Column
    medRecId: number;
    @BelongsTo(() => MedRec)
    medRecs: MedRec;

    @Column({
        get() {
            const expirationDate = this.getDataValue('expirationDate');
            return expirationDate ? new Date(expirationDate).toISOString().slice(0, 10) : null;
        }
    })
    expirationDate: Date;

    @Column({
        get() {
            return this.getDataValue('profilePath') !== null ? this.getDataValue('profilePath') : '/profile/no-profile-image.jpg';
        }
    })
    profilePath: string;

    @Column
    licensePath: string;

    @ForeignKey(() => Plans)
    @AllowNull
    @Column
    planId: number;
    @BelongsTo(() => Plans)
    plans: Plans;

    @Column
    planExpiryDate: Date;

    @ForeignKey(() => UserSubscription)
    @Column
    subscriptionId: number

    @Column({
        allowNull: true
    })
    verification_token: string;

    @Column({ defaultValue: true })
    isActive: boolean;

    @Column({
        defaultValue: 0,
        allowNull: false,
    })
    followersCount: number;

    @Column({
        defaultValue: 0,
        allowNull: false,
    })
    followingsCount: number;

    @HasOne(() => Brand, { foreignKey: 'userId', sourceKey: 'id', onDelete: 'cascade' })
    brand: Brand;

    @HasMany(() => Product, { onDelete: 'cascade' })
    products: Product;

    @HasMany(() => ProductFavourite, { onDelete: 'cascade' })
    productFavourites: ProductFavourite;

    @HasMany(() => UserSubscription, { onDelete: 'cascade' })
    userSubscription: UserSubscription;

    @HasMany(() => Review, { onDelete: 'cascade' })
    reviews: Review;

    @HasMany(() => Order, { foreignKey: 'retailerId', onDelete: 'cascade' })
    orders: Order;

    @HasMany(() => Message, { foreignKey: 'toId', onDelete: 'cascade' })
    toMessages: Message;

    @HasMany(() => Message, { foreignKey: 'fromId', onDelete: 'cascade' })
    fromMessages: Message;

    // @BelongsTo(() => UserRoles)
    // role: UserRoles;
    @HasMany(() => Follower, { foreignKey: 'followingId' })
    followers: Follower;

    @HasMany(() => Follower, { foreignKey: 'followerId' })
    followings: Follower;


}
