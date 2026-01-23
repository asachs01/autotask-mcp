// Lazy-loaded picklist cache for Autotask field values (queues, statuses, priorities, etc.)

import { Logger } from '../utils/logger.js';

export interface PicklistValue {
  value: string;
  label: string;
  isDefaultValue?: boolean;
  sortOrder?: number;
  isActive?: boolean;
  isSystem?: boolean;
  parentValue?: string;
}

export interface FieldInfo {
  name: string;
  dataType: string;
  length?: number;
  isRequired: boolean;
  isReadOnly: boolean;
  isQueryable: boolean;
  isReference: boolean;
  referenceEntityType?: string;
  isPickList: boolean;
  picklistValues?: PicklistValue[];
  picklistParentValueField?: string;
}

export class PicklistCache {
  private cache: Map<string, FieldInfo[]> = new Map();
  private loading: Map<string, Promise<FieldInfo[]>> = new Map();
  private logger: Logger;
  private getFieldInfoFn: (entityType: string) => Promise<FieldInfo[]>;

  constructor(
    logger: Logger,
    getFieldInfoFn: (entityType: string) => Promise<FieldInfo[]>
  ) {
    this.logger = logger;
    this.getFieldInfoFn = getFieldInfoFn;
  }

  /**
   * Get field info for an entity type (lazy-loaded, cached)
   */
  async getFields(entityType: string): Promise<FieldInfo[]> {
    // Return cached if available
    if (this.cache.has(entityType)) {
      return this.cache.get(entityType)!;
    }

    // If already loading, wait for that promise
    if (this.loading.has(entityType)) {
      return this.loading.get(entityType)!;
    }

    // Start loading
    const loadPromise = this.loadFields(entityType);
    this.loading.set(entityType, loadPromise);

    try {
      const fields = await loadPromise;
      this.cache.set(entityType, fields);
      return fields;
    } finally {
      this.loading.delete(entityType);
    }
  }

  /**
   * Get picklist values for a specific field on an entity type
   */
  async getPicklistValues(entityType: string, fieldName: string): Promise<PicklistValue[]> {
    const fields = await this.getFields(entityType);
    const field = fields.find(f => f.name.toLowerCase() === fieldName.toLowerCase());

    if (!field || !field.isPickList || !field.picklistValues) {
      return [];
    }

    return field.picklistValues.filter(v => v.isActive !== false);
  }

  /**
   * Get queues (picklist values for the queueID field on Tickets)
   */
  async getQueues(): Promise<PicklistValue[]> {
    return this.getPicklistValues('Tickets', 'queueID');
  }

  /**
   * Get ticket statuses
   */
  async getTicketStatuses(): Promise<PicklistValue[]> {
    return this.getPicklistValues('Tickets', 'status');
  }

  /**
   * Get ticket priorities
   */
  async getTicketPriorities(): Promise<PicklistValue[]> {
    return this.getPicklistValues('Tickets', 'priority');
  }

  /**
   * Clear cache (e.g., if picklist values change)
   */
  clearCache(entityType?: string): void {
    if (entityType) {
      this.cache.delete(entityType);
    } else {
      this.cache.clear();
    }
  }

  private async loadFields(entityType: string): Promise<FieldInfo[]> {
    this.logger.debug(`Loading field info for entity: ${entityType}`);
    try {
      const fields = await this.getFieldInfoFn(entityType);
      this.logger.debug(`Loaded ${fields.length} fields for ${entityType}`);
      return fields;
    } catch (error) {
      this.logger.error(`Failed to load field info for ${entityType}:`, error);
      return [];
    }
  }
}
