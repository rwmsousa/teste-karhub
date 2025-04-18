import { describe, it, expect } from '@jest/globals';
import { TestDataSource } from '../../config/test.database';

describe('Database Configuration', () => {
  it('should initialize the test database', async () => {
    expect(TestDataSource).toBeDefined();
    expect(TestDataSource.options.type).toBe('sqlite');
    expect(TestDataSource.options.database).toBe(':memory:');
  });
});
