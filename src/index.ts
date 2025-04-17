import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import beerStyleRoutes from './routes/beerStyle.routes';
import beerRecommendationRoutes from './routes/beerRecommendation.routes';
import { seedBeerStyles } from './database/seeds/BeerStyleSeeder';
import { BeerStyle } from './entities/BeerStyle';

const app = express();
const port = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    message: 'Beer Styles API',
    endpoints: {
      beerStyles: {
        list: 'GET /api/beer-styles',
        get: 'GET /api/beer-styles/:id',
        create: 'POST /api/beer-styles',
        update: 'PUT /api/beer-styles/:id',
        delete: 'DELETE /api/beer-styles/:id',
      },
      recommendation: {
        recommend: 'POST /api/recommendation',
      },
    },
  });
});

// Registrar as rotas
app.use('/api/beer-styles', beerStyleRoutes);
app.use('/api', beerRecommendationRoutes);

// Rota de fallback para 404
app.use((req, res) => {
  res.status(404).json({
    message: 'Endpoint not found',
    availableEndpoints: {
      root: 'GET /',
      beerStyles: {
        list: 'GET /api/beer-styles',
        get: 'GET /api/beer-styles/:id',
        create: 'POST /api/beer-styles',
        update: 'PUT /api/beer-styles/:id',
        delete: 'DELETE /api/beer-styles/:id',
      },
      recommendation: {
        recommend: 'POST /api/recommendation',
      },
    },
  });
});

async function waitForDatabase() {
  const maxAttempts = 10;
  const delay = 2000;

  for (let i = 0; i < maxAttempts; i++) {
    try {
      await AppDataSource.initialize();
      return true;
    } catch (error) {
      console.log(`Attempt ${i + 1}/${maxAttempts} - Waiting for database...`);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  return false;
}

async function initializeDatabase() {
  try {
    const connected = await waitForDatabase();
    if (!connected) {
      throw new Error('Failed to connect to database after multiple attempts');
    }

    const queryRunner = AppDataSource.createQueryRunner();
    await queryRunner.connect();
    const tableExists = await queryRunner.hasTable('beer_styles');
    await queryRunner.release();

    if (!tableExists) {
      await AppDataSource.synchronize();
    }

    const beerStyleRepository = AppDataSource.getRepository(BeerStyle);
    const existingStyles = await beerStyleRepository.find();

    if (existingStyles.length === 0) {
      try {
        await seedBeerStyles();
        const insertedStyles = await beerStyleRepository.find();

        if (insertedStyles.length === 0) {
          throw new Error('Failed to seed database');
        }
      } catch (error) {
        console.error('Error seeding database:', error);
        throw error;
      }
    }
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
}

// Inicializar o banco de dados e iniciar o servidor
initializeDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
