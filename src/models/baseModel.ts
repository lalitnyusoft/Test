import { Column, Model, BelongsTo } from 'sequelize-typescript';
import { User } from './user.model';

export class BaseModel extends Model {
    @Column({ defaultValue: true })
    isActive: boolean;

    /* @ForeignKey(() => User)
    @Column
    createdBy: number;
  
    @ForeignKey(() => User)
    @Column
    updatedBy: number; */

    // @BelongsTo(() => User, 'createdBy')
    // createdByUser: User;

    // @BelongsTo(() => User, 'updatedBy')
    // updatedByUser: User;
}
