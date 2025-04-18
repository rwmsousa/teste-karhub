import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import beerStyleRoutes from './routes/beerStyle.routes';
import beerRecommendationRoutes from './routes/beerRecommendation.routes';
import { initializeApp } from './app';

export const app = express();

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

const PORT = process.env.PORT || 3000;

initializeApp()
  .then((app) => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
