import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import { AppDataSource } from './config/database';
import beerStyleRoutes from './routes/beerStyle.routes';
import beerRecommendationRoutes from './routes/beerRecommendation.routes';

const app = express();

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

// Inicializar o banco de dados
export const initializeApp = async () => {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await AppDataSource.initialize();
      console.log('Database initialized successfully');
    }
    return app;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export { app };
