import {
  AutoIncrement,
  Column,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';

@Table({
  tableName: 'cms',
  paranoid: true,
})
export class Cms extends BaseModel {
  @PrimaryKey
  @AutoIncrement
  @Column
  id: number;

  @Column
  name: string;

  @Column
  slug: string;

  @Column({
    type: 'text',
  })
  content: string;
}