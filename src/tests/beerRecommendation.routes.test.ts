import {
  describe,
  it,
  expect,
  beforeAll,
  afterAll,
  afterEach,
  jest,
} from '@jest/globals';
import request from 'supertest';
import { app } from '../app';
import { TestDataSource } from '../config/test.database';
import { BeerStyle } from '../entities/BeerStyle';
import { Repository } from 'typeorm';

// Mock do SpotifyService
jest.mock('../services/SpotifyService', () => {
  const mockSearchPlaylist = jest.fn();
  const mockSpotifyService = {
    searchPlaylist: mockSearchPlaylist,
  };

  // Configurar o mock padrão para retornar uma playlist válida
  mockSearchPlaylist.mockImplementation(() =>
    Promise.resolve({
      name: 'Test Playlist',
      tracks: [
        {
          name: 'Test Track',
          artist: 'Test Artist',
          link: 'https://spotify.com/test',
        },
      ],
    }),
  );

  return {
    SpotifyService: jest.fn(() => mockSpotifyService),
  };
});

describe('Beer Recommendation Routes', () => {
  let beerStyleRepository: Repository<BeerStyle>;
  let mockSpotifyService: any;

  beforeAll(async () => {
    if (!TestDataSource.isInitialized) {
      await TestDataSource.initialize();
    }
    beerStyleRepository = TestDataSource.getRepository(BeerStyle);
    mockSpotifyService =
      new (require('../services/SpotifyService').SpotifyService)();
  });

  afterAll(async () => {
    if (TestDataSource.isInitialized) {
      await TestDataSource.destroy();
    }
  });

  afterEach(async () => {
    if (TestDataSource.isInitialized) {
      await beerStyleRepository.clear();
    }
    jest.clearAllMocks();
  });

  describe('POST /api/recommendation', () => {
    it('should recommend a beer style and playlist based on temperature', async () => {
      // Create a test beer style
      const testBeerStyle = await beerStyleRepository.save({
        name: 'Test Style',
        description: 'Test description',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      const temperature = 8;
      const response = await request(app)
        .post('/api/recommendation')
        .send({ temperature });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('beerStyle', 'Test Style');
      expect(response.body).toHaveProperty('playlist');
      expect(response.body.playlist).toHaveProperty('name', 'Test Playlist');
      expect(response.body.playlist).toHaveProperty('tracks');
      expect(response.body.playlist.tracks).toHaveLength(1);
    });

    it('should return 400 for invalid temperature', async () => {
      const response = await request(app)
        .post('/api/recommendation')
        .send({ temperature: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        'message',
        'Temperature must be a number',
      );
    });

    it('should return 404 when no beer style matches the temperature', async () => {
      const response = await request(app)
        .post('/api/recommendation')
        .send({ temperature: 100 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'No beer style found for the given temperature',
      );
    });

    it('should return 404 when no playlist is found for the beer style', async () => {
      // Create a test beer style
      await beerStyleRepository.save({
        name: 'Test Style',
        description: 'Test description',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      // Mock Spotify service to return null
      mockSpotifyService.searchPlaylist.mockResolvedValueOnce(null);

      const response = await request(app)
        .post('/api/recommendation')
        .send({ temperature: 8 });

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty(
        'message',
        'No playlist found for the recommended beer style',
      );
    });

    it('should select beer style with average temperature closest to input', async () => {
      // Style1: avg temp = 2.5
      const style1 = await beerStyleRepository.save({
        name: 'Dunkel',
        description: 'Dark German lager',
        minimumTemperature: 0,
        maximumTemperature: 5,
      });

      // Style2: avg temp = 4.5
      const style2 = await beerStyleRepository.save({
        name: 'Weissbier',
        description: 'German wheat beer',
        minimumTemperature: 3,
        maximumTemperature: 6,
      });

      const response = await request(app)
        .post('/api/recommendation')
        .send({ temperature: -2 });

      expect(response.status).toBe(200);
      expect(response.body.beerStyle).toBe('Dunkel'); // Should choose Dunkel as it's closer to -2
    });

    it('should return beer styles in alphabetical order when multiple have the same average temperature', async () => {
      // Both styles have average temp = 7.5
      const style1 = await beerStyleRepository.save({
        name: 'Pilsens',
        description: 'Czech lager',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      const style2 = await beerStyleRepository.save({
        name: 'IPA',
        description: 'India Pale Ale',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      const response = await request(app)
        .post('/api/recommendation')
        .send({ temperature: 7.5 });

      expect(response.status).toBe(200);
      expect(response.body.beerStyle).toBe('IPA'); // Should choose IPA as it comes first alphabetically
    });

    it('should handle multiple beer styles with same first letter by continuing alphabetical comparison', async () => {
      // All styles have average temp = 7.5
      const style1 = await beerStyleRepository.save({
        name: 'Porter',
        description: 'Dark beer',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      const style2 = await beerStyleRepository.save({
        name: 'Pilsens',
        description: 'Czech lager',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      const style3 = await beerStyleRepository.save({
        name: 'Pale Ale',
        description: 'Light ale',
        minimumTemperature: 5,
        maximumTemperature: 10,
      });

      const response = await request(app)
        .post('/api/recommendation')
        .send({ temperature: 7.5 });

      expect(response.status).toBe(200);
      expect(response.body.beerStyle).toBe('Pale Ale'); // Should choose Pale Ale as it comes first alphabetically
    });
  });
});
