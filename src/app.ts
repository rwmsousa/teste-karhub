import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import { AppDataSource } from './config/database';
import { swaggerSpec } from './config/swagger';
import beerStyleRoutes from './routes/beerStyle.routes';
import beerRecommendationRoutes from './routes/beerRecommendation.routes';
import { initializeDatabase } from './database/init';

const app = express();
const port = Number(process.env.PORT) || 3000;
const host = '0.0.0.0';

console.log('Starting server initialization...');
console.log(`Server will listen on ${host}:${port}`);

// Middlewares
app.use(cors());
app.use(express.json());

// Configuração do Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rota raiz
app.get('/', (req, res) => {
  console.log('Received request to root endpoint');
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
  console.log(`404 - Route not found: ${req.method} ${req.url}`);
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

// Error handling middleware
app.use(
  (
    err: Error,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    console.error('Unhandled error:', err);
    res.status(500).json({
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  },
);

// Inicializar o banco de dados e iniciar o servidor
console.log('Starting application...');
initializeDatabase()
  .then(() => {
    app.listen(port, host, () => {
      console.log(`✨ Server is running on http://${host}:${port}`);
      console.log('Available routes:');
      console.log('- GET /');
      console.log('- GET /api/beer-styles');
      console.log('- GET /api/beer-styles/:id');
      console.log('- POST /api/beer-styles');
      console.log('- PUT /api/beer-styles/:id');
      console.log('- DELETE /api/beer-styles/:id');
      console.log('- POST /api/recommendation');
    });
  })
  .catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });

export { app };
