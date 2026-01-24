/**
 * Unit tests for MappingService
 * Tests caching, singleton behavior, and name resolution
 */

import { MappingService } from '../src/utils/mapping.service';
import { AutotaskService } from '../src/services/autotask.service';
import { Logger } from '../src/utils/logger';

// Mock AutotaskService
jest.mock('../src/services/autotask.service');

const mockLogger = new Logger('error');

function createMockAutotaskService(): jest.Mocked<AutotaskService> {
  return {
    searchCompanies: jest.fn().mockResolvedValue([
      { id: 1, companyName: 'Acme Corp' },
      { id: 2, companyName: 'Widget Inc' },
    ]),
    searchResources: jest.fn().mockResolvedValue([
      { id: 10, firstName: 'John', lastName: 'Doe' },
      { id: 20, firstName: 'Jane', lastName: 'Smith' },
    ]),
    getResource: jest.fn().mockResolvedValue(
      { id: 10, firstName: 'John', lastName: 'Doe' }
    ),
  } as unknown as jest.Mocked<AutotaskService>;
}

describe('MappingService', () => {
  let mockService: jest.Mocked<AutotaskService>;

  beforeEach(() => {
    // Reset the singleton between tests
    (MappingService as any).initPromise = null;
    mockService = createMockAutotaskService();
  });

  describe('getInstance', () => {
    it('should create a singleton instance', async () => {
      const instance = await MappingService.getInstance(mockService, mockLogger);
      expect(instance).toBeInstanceOf(MappingService);
    });

    it('should return the same instance on subsequent calls', async () => {
      const first = await MappingService.getInstance(mockService, mockLogger);
      const second = await MappingService.getInstance(mockService, mockLogger);
      expect(first).toBe(second);
    });

    it('should initialize cache on creation', async () => {
      await MappingService.getInstance(mockService, mockLogger);
      expect(mockService.searchCompanies).toHaveBeenCalled();
      expect(mockService.searchResources).toHaveBeenCalled();
    });
  });

  describe('getCompanyName', () => {
    it('should return cached company name', async () => {
      const instance = await MappingService.getInstance(mockService, mockLogger);
      const name = await instance.getCompanyName(1);
      expect(name).toBe('Acme Corp');
    });

    it('should return null for unknown company ID', async () => {
      mockService.searchCompanies.mockResolvedValueOnce([]);
      const instance = await MappingService.getInstance(mockService, mockLogger);
      const name = await instance.getCompanyName(999);
      expect(name).toBeNull();
    });
  });

  describe('getResourceName', () => {
    it('should return cached resource name', async () => {
      const instance = await MappingService.getInstance(mockService, mockLogger);
      const name = await instance.getResourceName(10);
      expect(name).toBe('John Doe');
    });

    it('should fallback to direct lookup for uncached resources', async () => {
      mockService.getResource.mockResolvedValueOnce(
        { id: 30, firstName: 'Bob', lastName: 'Jones' } as any
      );
      const instance = await MappingService.getInstance(mockService, mockLogger);
      const name = await instance.getResourceName(30);
      expect(name).toBe('Bob Jones');
    });

    it('should return null when resource endpoint is unavailable', async () => {
      mockService.searchResources.mockResolvedValueOnce([]);
      const instance = await MappingService.getInstance(mockService, mockLogger);
      // Empty cache means endpoint is unavailable - should return null without direct lookup
      const name = await instance.getResourceName(99);
      expect(name).toBeNull();
    });
  });

  describe('getCacheStats', () => {
    it('should report cache statistics', async () => {
      const instance = await MappingService.getInstance(mockService, mockLogger);
      const stats = instance.getCacheStats();
      expect(stats.companies.count).toBe(2);
      expect(stats.resources.count).toBe(2);
      expect(stats.companies.isValid).toBe(true);
      expect(stats.resources.isValid).toBe(true);
    });
  });

  describe('clearCache', () => {
    it('should clear all cached data', async () => {
      const instance = await MappingService.getInstance(mockService, mockLogger);
      instance.clearCache();
      const stats = instance.getCacheStats();
      expect(stats.companies.count).toBe(0);
      expect(stats.resources.count).toBe(0);
    });
  });

  describe('error handling', () => {
    it('should handle searchCompanies failure gracefully', async () => {
      mockService.searchCompanies.mockRejectedValueOnce(new Error('API error'));
      const instance = await MappingService.getInstance(mockService, mockLogger);
      // Should still be instantiated, just with empty company cache
      expect(instance).toBeInstanceOf(MappingService);
    });

    it('should handle 405 from resources endpoint', async () => {
      const error = new Error('Method Not Allowed') as any;
      error.response = { status: 405 };
      mockService.searchResources.mockRejectedValueOnce(error);
      const instance = await MappingService.getInstance(mockService, mockLogger);
      const stats = instance.getCacheStats();
      expect(stats.resources.count).toBe(0);
      // Cache should still be marked as valid (prevents retry loops)
      expect(stats.resources.isValid).toBe(true);
    });
  });
});
