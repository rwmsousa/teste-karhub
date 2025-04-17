import { DataSource } from 'typeorm';
import { BeerStyle } from '../entities/BeerStyle';

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST || 'db',
  port: parseInt(process.env.DATABASE_PORT || '5432'),
  username: process.env.DATABASE_USER || 'postgres',
  password: process.env.DATABASE_PASSWORD || 'postgres',
  database: process.env.DATABASE_NAME || 'beer_styles_db',
  synchronize: true,
  logging: true,
  entities: [BeerStyle],
  subscribers: [],
  migrations: [],
  extra: {
    ssl: false,
  },
  connectTimeoutMS: 10000,
  poolSize: 10,
});
