import { DataSource } from 'typeorm';
import { BeerStyle } from '../entities/BeerStyle';

export const TestDataSource = new DataSource({
  type: 'sqlite',
  database: ':memory:',
  entities: [BeerStyle],
  synchronize: true,
  logging: false,
  dropSchema: true,
  name: 'test',
});
