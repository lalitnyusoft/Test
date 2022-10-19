import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    HasMany,
    ForeignKey,
    BelongsTo,
    DataType,
    IsNull,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { User } from './user.model';
import { Plans } from 'src/models/plans.model';
@Table({
    tableName: 'user_subscription',
    paranoid: true,
})
export class UserSubscription extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Plans)
    @Column
    planId: number;

    @Column
    customerId: string;

    @Column
    subscriptionToken: string;

    @Column
    subscriptionId: string;

    @Column
    status: string;

    @Column
    amount: string;

    @Column({
        type: DataType.TEXT
    })
    responseJson: string;

    @Column
    startDate: Date;

    @Column
    endDate: Date;

    @Column
    planCancelDate: string;

    @BelongsTo(() => User)
    user: User;

    @BelongsTo(() => Plans)
    plans: Plans;
}
