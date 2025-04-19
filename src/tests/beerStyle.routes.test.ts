import { describe, it, expect, beforeAll, afterEach } from '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { TestDataSource } from '../config/test.database';
import { BeerStyle } from '../entities/BeerStyle';
import { Repository } from 'typeorm';

describe('Beer Style Routes', () => {
  let beerStyleRepository: Repository<BeerStyle>;

  beforeAll(async () => {
    if (!TestDataSource.isInitialized) {
      await TestDataSource.initialize();
    }
    beerStyleRepository = TestDataSource.getRepository(BeerStyle);
  });

  afterEach(async () => {
    await beerStyleRepository.clear();
  });

  describe('GET /api/beer-styles', () => {
    it('should return all beer styles', async () => {
      await beerStyleRepository.save([
        {
          name: 'Style 1',
          description: 'Test style 1',
          minimumTemperature: 5,
          maximumTemperature: 10,
        },
        {
          name: 'Style 2',
          description: 'Test style 2',
          minimumTemperature: 8,
          maximumTemperature: 15,
        },
      ]);

      const response = await request(app).get('/api/beer-styles');

      expect(response.status).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBe(2);
      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('name');
      expect(response.body[0]).toHaveProperty('description');
    });
  });

  describe('GET /api/beer-styles/:id', () => {
    it('should return a specific beer style', async () => {
      const beerStyle = await beerStyleRepository.save({
        name: 'Test Style',
        description: 'Test description',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      const response = await request(app).get(
        `/api/beer-styles/${beerStyle.id}`,
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id', beerStyle.id);
      expect(response.body).toHaveProperty('name', beerStyle.name);
      expect(response.body).toHaveProperty(
        'description',
        beerStyle.description,
      );
    });

    it('should return 404 for non-existent beer style', async () => {
      const response = await request(app).get('/api/beer-styles/99999');

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Beer style not found');
    });
  });

  describe('POST /api/beer-styles', () => {
    it('should create a new beer style', async () => {
      const newBeerStyle = {
        name: 'Test Beer Style',
        description: 'A test beer style for testing purposes',
        minimumTemperature: 5,
        maximumTemperature: 10,
      };

      const response = await request(app)
        .post('/api/beer-styles')
        .send(newBeerStyle);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('name', newBeerStyle.name);
      expect(response.body).toHaveProperty(
        'description',
        newBeerStyle.description,
      );
    });

    it('should return 400 for invalid data', async () => {
      const invalidBeerStyle = {
        name: '',
        description: 'Invalid beer style',
      };

      const response = await request(app)
        .post('/api/beer-styles')
        .send(invalidBeerStyle);

      expect(response.status).toBe(400);
    });
  });

  describe('PUT /api/beer-styles/:id', () => {
    it('should update an existing beer style', async () => {
      const beerStyle = await beerStyleRepository.save({
        name: 'Original Style',
        description: 'Original description',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      const updatedData = {
        name: 'Updated Beer Style',
        description: 'Updated description',
      };

      const response = await request(app)
        .put(`/api/beer-styles/${beerStyle.id}`)
        .send(updatedData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', updatedData.name);
      expect(response.body).toHaveProperty(
        'description',
        updatedData.description,
      );
    });

    it('should return 404 for non-existent beer style', async () => {
      const response = await request(app)
        .put('/api/beer-styles/99999')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/beer-styles/:id', () => {
    it('should delete an existing beer style', async () => {
      const beerStyle = await beerStyleRepository.save({
        name: 'Style to Delete',
        description: 'Will be deleted',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      const response = await request(app).delete(
        `/api/beer-styles/${beerStyle.id}`,
      );

      expect(response.status).toBe(204);
    });

    it('should return 404 for non-existent beer style', async () => {
      const response = await request(app).delete('/api/beer-styles/99999');

      expect(response.status).toBe(404);
    });
  });
});
