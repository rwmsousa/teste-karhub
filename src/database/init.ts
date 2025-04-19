import { AppDataSource } from '../config/database';
import { seedBeerStyles } from './seeds/BeerStyleSeeder';
import { BeerStyle } from '../entities/BeerStyle';
import { Client } from 'pg';

async function createDatabaseIfNotExists() {
  const client = new Client({
    host: process.env.DATABASE_HOST || 'db',
    port: parseInt(process.env.DATABASE_PORT || '5432'),
    user: process.env.DATABASE_USER || 'postgres',
    password: process.env.DATABASE_PASSWORD || 'postgres',
    database: 'postgres', // Conecta ao banco padrão postgres
  });

  try {
    await client.connect();
    const dbName = process.env.DATABASE_NAME || 'beer_styles_db';

    // Verifica se o banco existe
    const result = await client.query(
      `SELECT 1 FROM pg_database WHERE datname = $1`,
      [dbName],
    );

    if (result.rows.length === 0) {
      console.log(`Database ${dbName} does not exist, creating...`);
      // Cria o banco de dados se não existir
      await client.query(`CREATE DATABASE ${dbName}`);
      console.log(`Database ${dbName} created successfully`);
    } else {
      console.log(`Database ${dbName} already exists`);
    }
  } catch (error) {
    console.error('Error creating database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

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

    // Tenta criar o banco de dados primeiro
    await createDatabaseIfNotExists();

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
