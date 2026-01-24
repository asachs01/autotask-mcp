/**
 * Mapping Service for Autotask ID-to-Name Resolution
 * Provides cached lookup functionality for company IDs and resource IDs
 */

import { AutotaskService } from '../services/autotask.service.js';
import { Logger } from './logger.js';

export interface MappingCache {
  companies: Map<number, string>;
  resources: Map<number, string>;
  lastUpdated: {
    companies: Date | null;
    resources: Date | null;
  };
}

export interface MappingResult {
  id: number;
  name: string;
  found: boolean;
}

export class MappingService {
  private static initPromise: Promise<MappingService> | null = null;

  private cache: MappingCache;
  private autotaskService: AutotaskService;
  private logger: Logger;
  private cacheExpiryMs: number;

  private constructor(autotaskService: AutotaskService, logger: Logger, cacheExpiryMs: number = 30 * 60 * 1000) { // 30 minutes default
    this.autotaskService = autotaskService;
    this.logger = logger;
    this.cacheExpiryMs = cacheExpiryMs;
    this.cache = {
      companies: new Map<number, string>(),
      resources: new Map<number, string>(),
      lastUpdated: {
        companies: null,
        resources: null,
      },
    };
  }

  /**
   * Get singleton instance (concurrent calls share the same initialization promise)
   */
  public static async getInstance(autotaskService: AutotaskService, logger: Logger): Promise<MappingService> {
    if (!MappingService.initPromise) {
      MappingService.initPromise = (async () => {
        const instance = new MappingService(autotaskService, logger);
        await instance.initializeCache();
        return instance;
      })();
    }
    return MappingService.initPromise;
  }

  /**
   * Initialize cache with company and resource data
   */
  private async initializeCache(): Promise<void> {
    if (this.isCacheValid('companies') && this.isCacheValid('resources')) {
      return;
    }

    this.logger.info('Initializing mapping cache...');
    await Promise.all([
      this.refreshCompanyCache(),
      this.refreshResourceCache()
    ]);
    this.cache.lastUpdated.companies = new Date();
    this.cache.lastUpdated.resources = new Date();
    this.logger.info('Mapping cache initialized successfully', {
      companies: this.cache.companies.size,
      resources: this.cache.resources.size
    });
  }

  /**
   * Check if cache is valid (not expired)
   */
  private isCacheValid(type: 'companies' | 'resources'): boolean {
    const lastUpdated = this.cache.lastUpdated[type];
    if (!lastUpdated) {
      return false;
    }

    const now = new Date();
    const timeDiff = now.getTime() - lastUpdated.getTime();
    return timeDiff < this.cacheExpiryMs;
  }

  /**
   * Refresh cache if needed (expired)
   */
  private async refreshCacheIfNeeded(): Promise<void> {
    const promises: Promise<void>[] = [];
    
    if (!this.isCacheValid('companies')) {
      promises.push(this.refreshCompanyCache());
    }
    
    if (!this.isCacheValid('resources')) {
      promises.push(this.refreshResourceCache());
    }
    
    if (promises.length > 0) {
      await Promise.all(promises);
    }
  }

  /**
   * Get company name by ID with fallback lookup
   */
  public async getCompanyName(companyId: number): Promise<string | null> {
    try {
      await this.refreshCacheIfNeeded();
      
      // Try cache first
      const cachedName = this.cache.companies.get(companyId);
      if (cachedName) {
        return cachedName;
      }
      
      // Fallback to direct API lookup
      this.logger.debug(`Company ${companyId} not in cache, doing direct lookup`);
      const companies = await this.autotaskService.searchCompanies({ 
        // No searchTerm needed - we'll find by ID after getting results
        pageSize: 0 // Get all companies to find this specific one
      });
      
      const company = companies.find((c: any) => c.id === companyId);
      if (company && company.companyName) {
        // Add to cache for future use
        this.cache.companies.set(companyId, company.companyName);
        return company.companyName;
      }
      
      return null;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.warn(`Failed to get company name for ID ${companyId}: ${errorMessage}`);
      return null;
    }
  }

  /**
   * Get resource name by ID with fallback lookup
   */
  public async getResourceName(resourceId: number): Promise<string | null> {
    try {
      await this.refreshCacheIfNeeded();
      
      // Try cache first
      const cachedName = this.cache.resources.get(resourceId);
      if (cachedName) {
        return cachedName;
      }
      
      // Check if we have any resources in cache - if not, the endpoint likely isn't available
      if (this.cache.resources.size === 0) {
        this.logger.debug(`Resource ${resourceId} not found - Resources endpoint not available in this Autotask instance`);
        return null; // Gracefully return null instead of attempting individual lookup
      }
      
      // Fallback to direct API lookup (if cache just doesn't have this specific resource)
      this.logger.debug(`Resource ${resourceId} not in cache, attempting direct lookup`);
      try {
        const resource = await this.autotaskService.getResource(resourceId);
        if (resource && resource.firstName && resource.lastName) {
          const fullName = `${resource.firstName} ${resource.lastName}`.trim();
          // Add to cache for future use
          this.cache.resources.set(resourceId, fullName);
          return fullName;
        }
      } catch (directError) {
        this.logger.debug(`Direct resource lookup failed for ${resourceId}:`, directError);
      }
      
      return null;
    } catch (error) {
      this.logger.error(`Failed to get resource name for ${resourceId}:`, error);
      return null;
    }
  }

  /**
   * Get multiple company names in a single call
   */
  async getCompanyNames(companyIds: number[]): Promise<(string | null)[]> {
    const results = await Promise.all(
      companyIds.map(id => this.getCompanyName(id))
    );
    return results;
  }

  /**
   * Get multiple resource names in a single call
   */
  async getResourceNames(resourceIds: number[]): Promise<(string | null)[]> {
    const results = await Promise.all(
      resourceIds.map(id => this.getResourceName(id))
    );
    return results;
  }

  /**
   * Refresh the company cache
   */
  private async refreshCompanyCache(): Promise<void> {
    if (this.isCacheValid('companies')) {
      return; // Cache is still valid
    }

    try {
      this.logger.info('Refreshing company cache...');
      
      // Use pagination-by-default to get ALL companies for complete accuracy
      const companies = await this.autotaskService.searchCompanies({
        // No pageSize specified - gets ALL companies via pagination by default
      });

      this.cache.companies.clear();
      
      for (const company of companies) {
        if (company.id && company.companyName) {
          this.cache.companies.set(company.id, company.companyName);
        }
      }

      this.cache.lastUpdated.companies = new Date();
      this.logger.info(`Company cache refreshed with ${this.cache.companies.size} entries (COMPLETE dataset)`);

    } catch (error) {
      this.logger.error('Failed to refresh company cache:', error);
      // Don't throw error - allow fallback to direct lookup
    }
  }

  /**
   * Refresh resource cache safely (handle endpoint limitations)
   */
  private async refreshResourceCache(): Promise<void> {
    try {
      this.logger.debug('Refreshing resource cache...');
      
      // Note: Some Autotask instances don't support resource listing via REST API
      // This is a known limitation - see Autotask documentation
      const resources = await this.autotaskService.searchResources({ pageSize: 0 });
      
      this.cache.resources.clear();
      for (const resource of resources) {
        if (resource.id && resource.firstName && resource.lastName) {
          const fullName = `${resource.firstName} ${resource.lastName}`.trim();
          this.cache.resources.set(resource.id, fullName);
        }
      }
      
      this.cache.lastUpdated.resources = new Date();
      this.logger.info(`Resource cache refreshed: ${this.cache.resources.size} resources`);
      
    } catch (error) {
      // Handle the common case where Resources endpoint returns 405 Method Not Allowed
      if ((error as any)?.response?.status === 405) {
        this.logger.warn('Resources endpoint not available (405 Method Not Allowed) - this is common in Autotask REST API. Resource name mapping will be disabled.');
        this.cache.lastUpdated.resources = new Date(); // Mark as "refreshed" to prevent retry loops
        return;
      }
      
      // Handle other resource endpoint errors gracefully
      this.logger.error('Failed to refresh resource cache, continuing without resource names:', error);
      this.cache.lastUpdated.resources = new Date(); // Mark as "refreshed" to prevent retry loops
    }
  }

  /**
   * Clear all caches
   */
  public clearCache(): void {
    this.cache.companies.clear();
    this.cache.resources.clear();
    this.cache.lastUpdated.companies = null;
    this.cache.lastUpdated.resources = null;
    this.logger.info('Mapping cache cleared');
  }

  /**
   * Clear company cache only
   */
  public clearCompanyCache(): void {
    this.cache.companies.clear();
    this.cache.lastUpdated.companies = null;
    this.logger.info('Company cache cleared');
  }

  /**
   * Clear resource cache only
   */
  public clearResourceCache(): void {
    this.cache.resources.clear();
    this.cache.lastUpdated.resources = null;
    this.logger.info('Resource cache cleared');
  }

  /**
   * Get cache statistics
   */
  public getCacheStats(): {
    companies: { count: number; lastUpdated: Date | null; isValid: boolean };
    resources: { count: number; lastUpdated: Date | null; isValid: boolean };
  } {
    return {
      companies: {
        count: this.cache.companies.size,
        lastUpdated: this.cache.lastUpdated.companies,
        isValid: this.isCacheValid('companies'),
      },
      resources: {
        count: this.cache.resources.size,
        lastUpdated: this.cache.lastUpdated.resources,
        isValid: this.isCacheValid('resources'),
      },
    };
  }

  /**
   * Preload caches (useful for warming up on startup)
   */
  async preloadCaches(): Promise<void> {
    this.logger.info('Preloading mapping caches...');
    try {
      await Promise.all([
        this.refreshCompanyCache(),
        this.refreshResourceCache(),
      ]);
      this.logger.info('Mapping caches preloaded successfully');
    } catch (error) {
      this.logger.error('Failed to preload caches:', error);
      throw error;
    }
  }
} 