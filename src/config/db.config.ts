import { SequelizeModuleOptions } from '@nestjs/sequelize';
require('dotenv').config();

const { DB_HOST, DB_PORT, DB_NAME, DB_USERNAME, DB_PASSWORD } = process.env;
export const config: SequelizeModuleOptions = {
  dialect: 'mysql',
  username: DB_USERNAME,
  password: DB_PASSWORD,
  port: parseInt(DB_PORT),
  host: DB_HOST,
  database: DB_NAME,
  synchronize: true,
  // alter: true,
  // models: ['dist/**/**.model{.ts,.js}'],
  autoLoadModels: true,
  logging: false,
};
