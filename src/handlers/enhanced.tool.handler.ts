/**
 * Enhanced Autotask Tool Handler with ID-to-Name Mapping
 * Extends the base tool handler to inline company and resource names into compact responses.
 */

import { McpToolResult } from './tool.handler.js';
import { AutotaskService } from '../services/autotask.service.js';
import { Logger } from '../utils/logger.js';
import { AutotaskToolHandler } from './tool.handler.js';
import { MappingService } from '../utils/mapping.service.js';

export class EnhancedAutotaskToolHandler extends AutotaskToolHandler {
  private mappingService: MappingService | null = null;

  constructor(autotaskService: AutotaskService, logger: Logger) {
    super(autotaskService, logger);
  }

  private async getMappingService(): Promise<MappingService> {
    if (!this.mappingService) {
      this.mappingService = await MappingService.getInstance(this.autotaskService, this.logger);
    }
    return this.mappingService;
  }

  public async callTool(name: string, args: any): Promise<McpToolResult> {
    try {
      const baseResult = await super.callTool(name, args);
      return await this.enhanceResult(baseResult);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      this.logger.error(`Enhanced tool execution failed: ${errorMessage}`);
      throw error;
    }
  }

  /**
   * Enhance compact response items by inlining company/resource names.
   * Handles both compact format (summary + items) and simple format (message + data).
   */
  private async enhanceResult(baseResult: McpToolResult): Promise<McpToolResult> {
    try {
      const content = baseResult.content[0];
      if (!content || !content.text || baseResult.isError) {
        return baseResult;
      }

      const parsed = JSON.parse(content.text);

      // Identify items to enhance from either format
      let items: any[] | null = null;
      if (parsed.items && Array.isArray(parsed.items)) {
        // Compact format: { summary, items }
        items = parsed.items;
      } else if (parsed.data && Array.isArray(parsed.data)) {
        // Simple format: { message, data }
        items = parsed.data;
      } else if (parsed.data && typeof parsed.data === 'object' && !Array.isArray(parsed.data)) {
        // Single item: { message, data: {...} }
        items = [parsed.data];
      }

      if (!items || items.length === 0) {
        return baseResult;
      }

      const mappingService = await this.getMappingService();

      // Map IDs to names and inline directly
      const enhanced = await Promise.allSettled(
        items.map(async (item) => {
          const result = { ...item };

          if (item.companyID != null && typeof item.companyID === 'number') {
            try {
              const name = await mappingService.getCompanyName(item.companyID);
              if (name) result.company = name;
            } catch { /* skip */ }
          }

          if (item.assignedResourceID != null && typeof item.assignedResourceID === 'number') {
            try {
              const name = await mappingService.getResourceName(item.assignedResourceID);
              if (name) result.assignedTo = name;
            } catch { /* skip */ }
          }

          if (item.projectLeadResourceID != null && typeof item.projectLeadResourceID === 'number') {
            try {
              const name = await mappingService.getResourceName(item.projectLeadResourceID);
              if (name) result.lead = name;
            } catch { /* skip */ }
          }

          return result;
        })
      );

      const enhancedItems = enhanced
        .filter((r): r is PromiseFulfilledResult<any> => r.status === 'fulfilled')
        .map(r => r.value);

      // Reconstruct the response
      let response: any;
      if (parsed.summary) {
        // Compact format
        response = { summary: parsed.summary, items: enhancedItems };
      } else if (parsed.data && Array.isArray(parsed.data)) {
        response = { message: parsed.message, data: enhancedItems };
      } else if (parsed.data) {
        response = { message: parsed.message, data: enhancedItems[0] || parsed.data };
      } else {
        response = parsed;
      }

      return {
        content: [{ type: 'text', text: JSON.stringify(response) }],
        isError: false
      };
    } catch (error) {
      this.logger.error('Failed to enhance result:', error);
      return baseResult;
    }
  }
} 