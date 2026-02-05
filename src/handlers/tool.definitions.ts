// Autotask Tool Definitions
// Declarative schema definitions for all MCP tools

import { McpTool } from './tool.handler.js';

export const TOOL_DEFINITIONS: McpTool[] = [
  // Connection testing
  {
    name: 'autotask_test_connection',
    description: 'Test the connection to Autotask API',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },

  // Company tools
  {
    name: 'autotask_search_companies',
    description: 'Search for companies in Autotask. Returns 25 results per page by default. Use page parameter for more results.',
    inputSchema: {
      type: 'object',
      properties: {
        searchTerm: {
          type: 'string',
          description: 'Search term for company name'
        },
        isActive: {
          type: 'boolean',
          description: 'Filter by active status'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 25, max: 200)',
          minimum: 1,
          maximum: 200
        }
      },
      required: []
    }
  },
  {
    name: 'autotask_create_company',
    description: 'Create a new company in Autotask',
    inputSchema: {
      type: 'object',
      properties: {
        companyName: {
          type: 'string',
          description: 'Company name'
        },
        companyType: {
          type: 'number',
          description: 'Company type ID'
        },
        phone: {
          type: 'string',
          description: 'Company phone number'
        },
        address1: {
          type: 'string',
          description: 'Company address line 1'
        },
        city: {
          type: 'string',
          description: 'Company city'
        },
        state: {
          type: 'string',
          description: 'Company state/province'
        },
        postalCode: {
          type: 'string',
          description: 'Company postal/ZIP code'
        },
        ownerResourceID: {
          type: 'number',
          description: 'Owner resource ID'
        },
        isActive: {
          type: 'boolean',
          description: 'Whether the company is active'
        }
      },
      required: ['companyName', 'companyType']
    }
  },
  {
    name: 'autotask_update_company',
    description: 'Update an existing company in Autotask',
    inputSchema: {
      type: 'object',
      properties: {
        id: {
          type: 'number',
          description: 'Company ID to update'
        },
        companyName: {
          type: 'string',
          description: 'Company name'
        },
        phone: {
          type: 'string',
          description: 'Company phone number'
        },
        address1: {
          type: 'string',
          description: 'Company address line 1'
        },
        city: {
          type: 'string',
          description: 'Company city'
        },
        state: {
          type: 'string',
          description: 'Company state/province'
        },
        postalCode: {
          type: 'string',
          description: 'Company postal/ZIP code'
        },
        isActive: {
          type: 'boolean',
          description: 'Whether the company is active'
        }
      },
      required: ['id']
    }
  },

  // Contact tools
  {
    name: 'autotask_search_contacts',
    description: 'Search for contacts in Autotask. Returns 25 results per page by default. Use page parameter for more results.',
    inputSchema: {
      type: 'object',
      properties: {
        searchTerm: {
          type: 'string',
          description: 'Search term for contact name or email'
        },
        companyID: {
          type: 'number',
          description: 'Filter by company ID'
        },
        isActive: {
          type: 'number',
          description: 'Filter by active status (1=active, 0=inactive)'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 25, max: 200)',
          minimum: 1,
          maximum: 200
        }
      },
      required: []
    }
  },
  {
    name: 'autotask_create_contact',
    description: 'Create a new contact in Autotask',
    inputSchema: {
      type: 'object',
      properties: {
        companyID: {
          type: 'number',
          description: 'Company ID for the contact'
        },
        firstName: {
          type: 'string',
          description: 'Contact first name'
        },
        lastName: {
          type: 'string',
          description: 'Contact last name'
        },
        emailAddress: {
          type: 'string',
          description: 'Contact email address'
        },
        phone: {
          type: 'string',
          description: 'Contact phone number'
        },
        title: {
          type: 'string',
          description: 'Contact job title'
        }
      },
      required: ['companyID', 'firstName', 'lastName']
    }
  },

  // Ticket tools
  {
    name: 'autotask_search_tickets',
    description: 'Search for tickets in Autotask. Returns 25 results per page by default. Use page parameter for more results. Use get_ticket_details for full data on a specific ticket.',
    inputSchema: {
      type: 'object',
      properties: {
        searchTerm: {
          type: 'string',
          description: 'Search by ticket number prefix'
        },
        companyID: {
          type: 'number',
          description: 'Filter by company ID'
        },
        status: {
          type: 'number',
          description: 'Filter by ticket status ID (omit for all open tickets)'
        },
        assignedResourceID: {
          type: 'number',
          description: 'Filter by assigned resource ID'
        },
        unassigned: {
          type: 'boolean',
          description: 'Set to true to find unassigned tickets'
        },
        createdAfter: {
          type: 'string',
          description: 'Filter tickets created on or after this date (ISO format, e.g. 2026-01-01)'
        },
        createdBefore: {
          type: 'string',
          description: 'Filter tickets created on or before this date (ISO format)'
        },
        lastActivityAfter: {
          type: 'string',
          description: 'Filter tickets with activity on or after this date (ISO format)'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 25, max: 500)',
          minimum: 1,
          maximum: 500
        }
      },
      required: []
    }
  },
  {
    name: 'autotask_get_ticket_details',
    description: 'Get detailed information for a specific ticket by ID. Use this for full ticket data when needed.',
    inputSchema: {
      type: 'object',
      properties: {
        ticketID: {
          type: 'number',
          description: 'Ticket ID to retrieve'
        },
        fullDetails: {
          type: 'boolean',
          description: 'Whether to return full ticket details (default: false for optimized data)',
          default: false
        }
      },
      required: ['ticketID']
    }
  },
  {
    name: 'autotask_create_ticket',
    description: 'Create a new ticket in Autotask',
    inputSchema: {
      type: 'object',
      properties: {
        companyID: {
          type: 'number',
          description: 'Company ID for the ticket'
        },
        title: {
          type: 'string',
          description: 'Ticket title'
        },
        description: {
          type: 'string',
          description: 'Ticket description'
        },
        status: {
          type: 'number',
          description: 'Ticket status ID'
        },
        priority: {
          type: 'number',
          description: 'Ticket priority ID'
        },
        assignedResourceID: {
          type: 'number',
          description: 'Assigned resource ID'
        },
        contactID: {
          type: 'number',
          description: 'Contact ID for the ticket'
        }
      },
      required: ['companyID', 'title', 'description']
    }
  },

  // Time entry tools
  {
    name: 'autotask_create_time_entry',
    description: 'Create a time entry in Autotask',
    inputSchema: {
      type: 'object',
      properties: {
        ticketID: {
          type: 'number',
          description: 'Ticket ID for the time entry'
        },
        taskID: {
          type: 'number',
          description: 'Task ID for the time entry (optional, for project work)'
        },
        resourceID: {
          type: 'number',
          description: 'Resource ID (user) logging the time'
        },
        dateWorked: {
          type: 'string',
          description: 'Date worked (YYYY-MM-DD format)'
        },
        startDateTime: {
          type: 'string',
          description: 'Start date/time (ISO format)'
        },
        endDateTime: {
          type: 'string',
          description: 'End date/time (ISO format)'
        },
        hoursWorked: {
          type: 'number',
          description: 'Number of hours worked'
        },
        summaryNotes: {
          type: 'string',
          description: 'Summary notes for the time entry'
        },
        internalNotes: {
          type: 'string',
          description: 'Internal notes for the time entry'
        }
      },
      required: ['resourceID', 'dateWorked', 'hoursWorked', 'summaryNotes']
    }
  },

  // Project tools
  {
    name: 'autotask_search_projects',
    description: 'Search for projects in Autotask. Returns 25 results per page by default. Use page parameter for more results.',
    inputSchema: {
      type: 'object',
      properties: {
        searchTerm: {
          type: 'string',
          description: 'Search term for project name'
        },
        companyID: {
          type: 'number',
          description: 'Filter by company ID'
        },
        status: {
          type: 'number',
          description: 'Filter by project status'
        },
        projectLeadResourceID: {
          type: 'number',
          description: 'Filter by project lead resource ID'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 25, max: 100)',
          minimum: 1,
          maximum: 100
        }
      },
      required: []
    }
  },
  {
    name: 'autotask_create_project',
    description: 'Create a new project in Autotask',
    inputSchema: {
      type: 'object',
      properties: {
        companyID: {
          type: 'number',
          description: 'Company ID for the project'
        },
        projectName: {
          type: 'string',
          description: 'Project name'
        },
        description: {
          type: 'string',
          description: 'Project description'
        },
        status: {
          type: 'number',
          description: 'Project status (1=New, 2=In Progress, 5=Complete)'
        },
        startDate: {
          type: 'string',
          description: 'Project start date (YYYY-MM-DD)'
        },
        endDate: {
          type: 'string',
          description: 'Project end date (YYYY-MM-DD)'
        },
        projectLeadResourceID: {
          type: 'number',
          description: 'Project manager resource ID'
        },
        estimatedHours: {
          type: 'number',
          description: 'Estimated hours for the project'
        }
      },
      required: ['companyID', 'projectName', 'status']
    }
  },

  // Resource tools
  {
    name: 'autotask_search_resources',
    description: 'Search for resources (users) in Autotask. Returns 25 results per page by default. Use page parameter for more results.',
    inputSchema: {
      type: 'object',
      properties: {
        searchTerm: {
          type: 'string',
          description: 'Search term for resource name or email'
        },
        isActive: {
          type: 'boolean',
          description: 'Filter by active status'
        },
        resourceType: {
          type: 'number',
          description: 'Filter by resource type (1=Employee, 2=Contractor, 3=Temporary)'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 25, max: 500)',
          minimum: 1,
          maximum: 500
        }
      },
      required: []
    }
  },

  // Ticket Notes tools
  {
    name: 'autotask_get_ticket_note',
    description: 'Get a specific ticket note by ticket ID and note ID',
    inputSchema: {
      type: 'object',
      properties: {
        ticketId: {
          type: 'number',
          description: 'The ticket ID'
        },
        noteId: {
          type: 'number',
          description: 'The note ID to retrieve'
        }
      },
      required: ['ticketId', 'noteId']
    }
  },
  {
    name: 'autotask_search_ticket_notes',
    description: 'Search for notes on a specific ticket',
    inputSchema: {
      type: 'object',
      properties: {
        ticketId: {
          type: 'number',
          description: 'The ticket ID to search notes for'
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 25, max: 100)',
          minimum: 1,
          maximum: 100
        }
      },
      required: ['ticketId']
    }
  },
  {
    name: 'autotask_create_ticket_note',
    description: 'Create a new note for a ticket',
    inputSchema: {
      type: 'object',
      properties: {
        ticketId: {
          type: 'number',
          description: 'The ticket ID to add the note to'
        },
        title: {
          type: 'string',
          description: 'Note title'
        },
        description: {
          type: 'string',
          description: 'Note content'
        },
        noteType: {
          type: 'number',
          description: 'Note type (1=General, 2=Appointment, 3=Task, 4=Ticket, 5=Project, 6=Opportunity)'
        },
        publish: {
          type: 'number',
          description: 'Publish level (1=Internal Only, 2=All Autotask Users, 3=Everyone)'
        }
      },
      required: ['ticketId', 'description']
    }
  },

  // Project Notes tools
  {
    name: 'autotask_get_project_note',
    description: 'Get a specific project note by project ID and note ID',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'number',
          description: 'The project ID'
        },
        noteId: {
          type: 'number',
          description: 'The note ID to retrieve'
        }
      },
      required: ['projectId', 'noteId']
    }
  },
  {
    name: 'autotask_search_project_notes',
    description: 'Search for notes on a specific project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'number',
          description: 'The project ID to search notes for'
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 25, max: 100)',
          minimum: 1,
          maximum: 100
        }
      },
      required: ['projectId']
    }
  },
  {
    name: 'autotask_create_project_note',
    description: 'Create a new note for a project',
    inputSchema: {
      type: 'object',
      properties: {
        projectId: {
          type: 'number',
          description: 'The project ID to add the note to'
        },
        title: {
          type: 'string',
          description: 'Note title'
        },
        description: {
          type: 'string',
          description: 'Note content'
        },
        noteType: {
          type: 'number',
          description: 'Note type (1=General, 2=Appointment, 3=Task, 4=Ticket, 5=Project, 6=Opportunity)'
        }
      },
      required: ['projectId', 'description']
    }
  },

  // Company Notes tools
  {
    name: 'autotask_get_company_note',
    description: 'Get a specific company note by company ID and note ID',
    inputSchema: {
      type: 'object',
      properties: {
        companyId: {
          type: 'number',
          description: 'The company ID'
        },
        noteId: {
          type: 'number',
          description: 'The note ID to retrieve'
        }
      },
      required: ['companyId', 'noteId']
    }
  },
  {
    name: 'autotask_search_company_notes',
    description: 'Search for notes on a specific company',
    inputSchema: {
      type: 'object',
      properties: {
        companyId: {
          type: 'number',
          description: 'The company ID to search notes for'
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 25, max: 100)',
          minimum: 1,
          maximum: 100
        }
      },
      required: ['companyId']
    }
  },
  {
    name: 'autotask_create_company_note',
    description: 'Create a new note for a company',
    inputSchema: {
      type: 'object',
      properties: {
        companyId: {
          type: 'number',
          description: 'The company ID to add the note to'
        },
        title: {
          type: 'string',
          description: 'Note title'
        },
        description: {
          type: 'string',
          description: 'Note content'
        },
        actionType: {
          type: 'number',
          description: 'Action type for the note'
        }
      },
      required: ['companyId', 'description']
    }
  },

  // Ticket Attachments tools
  {
    name: 'autotask_get_ticket_attachment',
    description: 'Get a specific ticket attachment by ticket ID and attachment ID',
    inputSchema: {
      type: 'object',
      properties: {
        ticketId: {
          type: 'number',
          description: 'The ticket ID'
        },
        attachmentId: {
          type: 'number',
          description: 'The attachment ID to retrieve'
        },
        includeData: {
          type: 'boolean',
          description: 'Whether to include base64 encoded file data (default: false)',
          default: false
        }
      },
      required: ['ticketId', 'attachmentId']
    }
  },
  {
    name: 'autotask_search_ticket_attachments',
    description: 'Search for attachments on a specific ticket',
    inputSchema: {
      type: 'object',
      properties: {
        ticketId: {
          type: 'number',
          description: 'The ticket ID to search attachments for'
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 10, max: 50)',
          minimum: 1,
          maximum: 50
        }
      },
      required: ['ticketId']
    }
  },

  // Expense Reports tools
  {
    name: 'autotask_get_expense_report',
    description: 'Get a specific expense report by ID',
    inputSchema: {
      type: 'object',
      properties: {
        reportId: {
          type: 'number',
          description: 'The expense report ID to retrieve'
        }
      },
      required: ['reportId']
    }
  },
  {
    name: 'autotask_search_expense_reports',
    description: 'Search for expense reports with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        submitterId: {
          type: 'number',
          description: 'Filter by submitter resource ID'
        },
        status: {
          type: 'number',
          description: 'Filter by status (1=New, 2=Submitted, 3=Approved, 4=Paid, 5=Rejected, 6=InReview)'
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 25, max: 100)',
          minimum: 1,
          maximum: 100
        }
      },
      required: []
    }
  },
  {
    name: 'autotask_create_expense_report',
    description: 'Create a new expense report',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Expense report name'
        },
        description: {
          type: 'string',
          description: 'Expense report description'
        },
        submitterId: {
          type: 'number',
          description: 'The resource ID of the submitter'
        },
        weekEndingDate: {
          type: 'string',
          description: 'Week ending date (YYYY-MM-DD format)'
        }
      },
      required: ['submitterId']
    }
  },

  // Quotes tools
  {
    name: 'autotask_get_quote',
    description: 'Get a specific quote by ID',
    inputSchema: {
      type: 'object',
      properties: {
        quoteId: {
          type: 'number',
          description: 'The quote ID to retrieve'
        }
      },
      required: ['quoteId']
    }
  },
  {
    name: 'autotask_search_quotes',
    description: 'Search for quotes with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        companyId: {
          type: 'number',
          description: 'Filter by company ID'
        },
        contactId: {
          type: 'number',
          description: 'Filter by contact ID'
        },
        opportunityId: {
          type: 'number',
          description: 'Filter by opportunity ID'
        },
        searchTerm: {
          type: 'string',
          description: 'Search term for quote name or description'
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 25, max: 100)',
          minimum: 1,
          maximum: 100
        }
      },
      required: []
    }
  },
  {
    name: 'autotask_create_quote',
    description: 'Create a new quote',
    inputSchema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Quote name'
        },
        description: {
          type: 'string',
          description: 'Quote description'
        },
        companyId: {
          type: 'number',
          description: 'Company ID for the quote'
        },
        contactId: {
          type: 'number',
          description: 'Contact ID for the quote'
        },
        opportunityId: {
          type: 'number',
          description: 'Associated opportunity ID'
        },
        effectiveDate: {
          type: 'string',
          description: 'Effective date (YYYY-MM-DD format)'
        },
        expirationDate: {
          type: 'string',
          description: 'Expiration date (YYYY-MM-DD format)'
        }
      },
      required: ['companyId']
    }
  },

  // Configuration Item tools
  {
    name: 'autotask_search_configuration_items',
    description: 'Search for configuration items in Autotask with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        searchTerm: {
          type: 'string',
          description: 'Search term for configuration item name'
        },
        companyID: {
          type: 'number',
          description: 'Filter by company ID'
        },
        isActive: {
          type: 'boolean',
          description: 'Filter by active status'
        },
        productID: {
          type: 'number',
          description: 'Filter by product ID'
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 25, max: 500)',
          minimum: 1,
          maximum: 500
        }
      },
      required: []
    }
  },

  // Contract tools
  {
    name: 'autotask_search_contracts',
    description: 'Search for contracts in Autotask with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        searchTerm: {
          type: 'string',
          description: 'Search term for contract name'
        },
        companyID: {
          type: 'number',
          description: 'Filter by company ID'
        },
        status: {
          type: 'number',
          description: 'Filter by contract status (1=In Effect, 3=Terminated)'
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 25, max: 500)',
          minimum: 1,
          maximum: 500
        }
      },
      required: []
    }
  },

  // Invoice tools
  {
    name: 'autotask_search_invoices',
    description: 'Search for invoices in Autotask with optional filters',
    inputSchema: {
      type: 'object',
      properties: {
        companyID: {
          type: 'number',
          description: 'Filter by company ID'
        },
        invoiceNumber: {
          type: 'string',
          description: 'Filter by invoice number'
        },
        isVoided: {
          type: 'boolean',
          description: 'Filter by voided status'
        },
        pageSize: {
          type: 'number',
          description: 'Number of results to return (default: 25, max: 500)',
          minimum: 1,
          maximum: 500
        }
      },
      required: []
    }
  },

  // Task tools
  {
    name: 'autotask_search_tasks',
    description: 'Search for tasks in Autotask. Returns 25 results per page by default. Use page parameter for more results.',
    inputSchema: {
      type: 'object',
      properties: {
        searchTerm: {
          type: 'string',
          description: 'Search term for task title'
        },
        projectID: {
          type: 'number',
          description: 'Filter by project ID'
        },
        status: {
          type: 'number',
          description: 'Filter by task status (1=New, 2=In Progress, 5=Complete)'
        },
        assignedResourceID: {
          type: 'number',
          description: 'Filter by assigned resource ID'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 25, max: 100)',
          minimum: 1,
          maximum: 100
        }
      },
      required: []
    }
  },
  {
    name: 'autotask_create_task',
    description: 'Create a new task in Autotask',
    inputSchema: {
      type: 'object',
      properties: {
        projectID: {
          type: 'number',
          description: 'Project ID for the task'
        },
        title: {
          type: 'string',
          description: 'Task title'
        },
        description: {
          type: 'string',
          description: 'Task description'
        },
        status: {
          type: 'number',
          description: 'Task status (1=New, 2=In Progress, 5=Complete)'
        },
        assignedResourceID: {
          type: 'number',
          description: 'Assigned resource ID'
        },
        estimatedHours: {
          type: 'number',
          description: 'Estimated hours for the task'
        },
        startDateTime: {
          type: 'string',
          description: 'Task start date/time (ISO format)'
        },
        endDateTime: {
          type: 'string',
          description: 'Task end date/time (ISO format)'
        }
      },
      required: ['projectID', 'title', 'status']
    }
  },

  // Picklist / Queue tools
  {
    name: 'autotask_list_queues',
    description: 'List all available ticket queues in Autotask. Use this to find queue IDs for filtering tickets by queue.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'autotask_list_ticket_statuses',
    description: 'List all available ticket statuses in Autotask. Use this to find status values for filtering or creating tickets.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'autotask_list_ticket_priorities',
    description: 'List all available ticket priorities in Autotask. Use this to find priority values for filtering or creating tickets.',
    inputSchema: {
      type: 'object',
      properties: {},
      required: []
    }
  },
  {
    name: 'autotask_get_field_info',
    description: 'Get field definitions for an Autotask entity type, including picklist values. Useful for discovering valid values for any picklist field.',
    inputSchema: {
      type: 'object',
      properties: {
        entityType: {
          type: 'string',
          description: 'The Autotask entity type (e.g., "Tickets", "Companies", "Contacts", "Projects")'
        },
        fieldName: {
          type: 'string',
          description: 'Optional: filter to a specific field name'
        }
      },
      required: ['entityType']
    }
  },

  // Billing Items tools (Approve and Post workflow)
  {
    name: 'autotask_search_billing_items',
    description: 'Search for billing items in Autotask. Billing items represent approved and posted billable items from the "Approve and Post" workflow. Returns 25 results per page by default.',
    inputSchema: {
      type: 'object',
      properties: {
        companyId: {
          type: 'number',
          description: 'Filter by company ID'
        },
        ticketId: {
          type: 'number',
          description: 'Filter by ticket ID'
        },
        projectId: {
          type: 'number',
          description: 'Filter by project ID'
        },
        contractId: {
          type: 'number',
          description: 'Filter by contract ID'
        },
        invoiceId: {
          type: 'number',
          description: 'Filter by invoice ID'
        },
        postedAfter: {
          type: 'string',
          description: 'Filter items posted on or after this date (ISO format, e.g. 2026-01-01)'
        },
        postedBefore: {
          type: 'string',
          description: 'Filter items posted on or before this date (ISO format)'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 25, max: 500)',
          minimum: 1,
          maximum: 500
        }
      },
      required: []
    }
  },
  {
    name: 'autotask_get_billing_item',
    description: 'Get detailed information for a specific billing item by ID',
    inputSchema: {
      type: 'object',
      properties: {
        billingItemId: {
          type: 'number',
          description: 'The billing item ID to retrieve'
        }
      },
      required: ['billingItemId']
    }
  },

  // Billing Item Approval Levels tools
  {
    name: 'autotask_search_billing_item_approval_levels',
    description: 'Search for billing item approval levels. These describe multi-level approval records for Autotask time entries, enabling visibility into tiered approval workflows.',
    inputSchema: {
      type: 'object',
      properties: {
        timeEntryId: {
          type: 'number',
          description: 'Filter by time entry ID'
        },
        approvalResourceId: {
          type: 'number',
          description: 'Filter by approver resource ID'
        },
        approvalLevel: {
          type: 'number',
          description: 'Filter by approval level (1, 2, 3, etc.)'
        },
        approvedAfter: {
          type: 'string',
          description: 'Filter approvals on or after this date (ISO format)'
        },
        approvedBefore: {
          type: 'string',
          description: 'Filter approvals on or before this date (ISO format)'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 25, max: 500)',
          minimum: 1,
          maximum: 500
        }
      },
      required: []
    }
  },

  // Time Entries search tool
  {
    name: 'autotask_search_time_entries',
    description: 'Search for time entries in Autotask. Returns 25 results per page by default. Time entries can be filtered by resource, ticket, project, task, or date range.',
    inputSchema: {
      type: 'object',
      properties: {
        resourceId: {
          type: 'number',
          description: 'Filter by resource (user) ID'
        },
        ticketId: {
          type: 'number',
          description: 'Filter by ticket ID'
        },
        projectId: {
          type: 'number',
          description: 'Filter by project ID'
        },
        taskId: {
          type: 'number',
          description: 'Filter by task ID'
        },
        dateWorkedAfter: {
          type: 'string',
          description: 'Filter entries worked on or after this date (ISO format, e.g. 2026-01-01)'
        },
        dateWorkedBefore: {
          type: 'string',
          description: 'Filter entries worked on or before this date (ISO format)'
        },
        page: {
          type: 'number',
          description: 'Page number for pagination (default: 1)',
          minimum: 1
        },
        pageSize: {
          type: 'number',
          description: 'Results per page (default: 25, max: 500)',
          minimum: 1,
          maximum: 500
        }
      },
      required: []
    }
  }
];
