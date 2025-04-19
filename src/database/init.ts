import { AppDataSource } from '../config/database';
import { seedBeerStyles } from './seeds/BeerStyleSeeder';
import { BeerStyle } from '../entities/BeerStyle';

async function waitForDatabase() {
  const maxAttempts = 10;
  const delay = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      console.log(`Database connection attempt ${i + 1}/${maxAttempts}...`);
      await AppDataSource.initialize();
      console.log('Database connection successful!');
      return true;
    } catch (error) {
      console.error(`Database connection attempt ${i + 1} failed:`, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
}

export async function initializeDatabase() {
  try {
    console.log('Starting database initialization...');
    const connected = await waitForDatabase();
    if (!connected) {
      throw new Error('Failed to connect to database after multiple attempts');
    }

    console.log('Checking database tables...');
    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const tableExists = await queryRunner.hasTable('beer_styles');
    await queryRunner.release();

    if (!tableExists) {
      console.log('Creating database tables...');
      await AppDataSource.synchronize();
      console.log('Database tables created successfully!');
    }

    console.log('Checking for existing beer styles...');
    const beerStyleRepository = AppDataSource.getRepository(BeerStyle);
    const existingStyles = await beerStyleRepository.find();

    if (existingStyles.length === 0) {
      console.log('No beer styles found, seeding database...');
      try {
        await seedBeerStyles();
        const insertedStyles = await beerStyleRepository.find();

        if (insertedStyles.length === 0) {
          throw new Error('Failed to seed database');
        }
        console.log(
          `Database seeded with ${insertedStyles.length} beer styles!`,
        );
      } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
      }
    } else {
      console.log(`Found ${existingStyles.length} existing beer styles`);
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
}
