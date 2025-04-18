import { AppDataSource } from '../config/database';
import { seedBeerStyles } from '../database/seeds/BeerStyleSeeder';

async function main() {
  try {
    await AppDataSource.initialize();
    console.log('Database initialized successfully');

    await seedBeerStyles();
    console.log('Beer styles seeded successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
}

main();
