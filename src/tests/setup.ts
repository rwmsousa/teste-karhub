import { beforeAll, afterAll } from '@jest/globals';
import { TestDataSource } from '../config/test.database';

beforeAll(async () => {
  try {
    if (!TestDataSource.isInitialized) {
      await TestDataSource.initialize();
    }
  } catch (error) {
    console.error('Error during test setup:', error);
    throw error;
  }
});

afterAll(async () => {
  try {
    if (TestDataSource.isInitialized) {
      await TestDataSource.destroy();
    }
  } catch (error) {
    console.error('Error during test teardown:', error);
    throw error;
  }
});

process.env.NODE_ENV = 'test';
