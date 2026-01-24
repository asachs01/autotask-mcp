// Autotask Entity Type Definitions
// Based on the autotask-node library types

export interface AutotaskCompany {
  id?: number;
  companyName?: string;
  companyType?: number;
  phone?: string;
  address1?: string;
  address2?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  countryID?: number;
  isActive?: boolean;
  ownerResourceID?: number;
  createDate?: string;
  lastActivityDate?: string;
  lastTrackedModifiedDateTime?: string;
  [key: string]: any;
}

export interface AutotaskContact {
  id?: number;
  companyID?: number;
  firstName?: string;
  lastName?: string;
  emailAddress?: string;
  phone?: string;
  title?: string;
  isActive?: number; // Note: autotask-node uses number, not boolean
  createDate?: string;
  lastModifiedDate?: string;
  [key: string]: any;
}

export interface AutotaskTicket {
  id?: number;
  ticketNumber?: string;
  companyID?: number;
  contactID?: number;
  assignedResourceID?: number;
  title?: string;
  description?: string;
  status?: number;
  priority?: number;
  ticketType?: number;
  issueType?: number;
  subIssueType?: number;
  createDate?: string;
  createdByContactID?: number;
  createdByResourceID?: number;
  dueDateTime?: string;
  completedDate?: string;
  lastActivityDate?: string;
  estimatedHours?: number;
  hoursToBeScheduled?: number;
  [key: string]: any;
}

export interface AutotaskResource {
  id?: number;
  firstName?: string;
  lastName?: string;
  userName?: string;
  email?: string;
  isActive?: boolean;
  title?: string;
  resourceType?: number;
  userType?: number;
  [key: string]: any;
}

export interface AutotaskProject {
  id?: number;
  companyID?: number;
  projectName?: string;
  projectNumber?: string;
  description?: string;
  status?: number;
  projectType?: number;
  department?: number;
  startDate?: string;
  endDate?: string;
  startDateTime?: string;
  endDateTime?: string;
  projectLeadResourceID?: number;
  estimatedHours?: number;
  actualHours?: number;
  laborEstimatedRevenue?: number;
  createDate?: string;
  completedDate?: string;
  contractID?: number;
  originalEstimatedRevenue?: number;
  [key: string]: any;
}

export interface AutotaskTimeEntry {
  id?: number;
  resourceID?: number;
  ticketID?: number;
  projectID?: number;
  taskID?: number;
  dateWorked?: string;
  startDateTime?: string;
  endDateTime?: string;
  hoursWorked?: number;
  hoursToBill?: number;
  offsetHours?: number;
  summaryNotes?: string;
  internalNotes?: string;
  billableToAccount?: boolean;
  isNonBillable?: boolean;
  createDate?: string;
  createdByResourceID?: number;
  lastModifiedDate?: string;
  lastModifiedByResourceID?: number;
  [key: string]: any;
}

// Additional interfaces that were missing
export interface AutotaskConfigurationItem {
  id?: number;
  companyID?: number;
  serialNumber?: string;
  configurationItemName?: string;
  configurationItemType?: number;
  configurationItemCategoryID?: number;
  isActive?: boolean;
  warrantyExpirationDate?: string;
  lastActivityDate?: string;
  [key: string]: any;
}

export interface AutotaskContract {
  id?: number;
  companyID?: number;
  contractName?: string;
  contractNumber?: string;
  startDate?: string;
  endDate?: string;
  status?: number;
  contactID?: number;
  [key: string]: any;
}

export interface AutotaskInvoice {
  id?: number;
  companyID?: number;
  invoiceNumber?: string;
  invoiceDate?: string;
  totalAmount?: number;
  paidAmount?: number;
  isVoided?: boolean;
  [key: string]: any;
}

export interface AutotaskTask {
  id?: number;
  projectID?: number;
  title?: string;
  description?: string;
  assignedResourceID?: number;
  status?: number;
  priority?: number;
  startDate?: string;
  endDate?: string;
  estimatedHours?: number;
  actualHours?: number;
  [key: string]: any;
}

export interface AutotaskTicketNote {
  id?: number;
  ticketID?: number;
  noteType?: number;
  title?: string;
  description?: string;
  createDate?: string;
  createdByResourceID?: number;
  isVisibleToClientPortal?: boolean;
  [key: string]: any;
}

export interface AutotaskProjectNote {
  id?: number;
  projectID?: number;
  noteType?: number;
  title?: string;
  description?: string;
  createDate?: string;
  createdByResourceID?: number;
  [key: string]: any;
}

export interface AutotaskCompanyNote {
  id?: number;
  companyID?: number;
  noteType?: number;
  title?: string;
  description?: string;
  createDate?: string;
  createdByResourceID?: number;
  [key: string]: any;
}

export interface AutotaskTicketAttachment {
  id?: number;
  ticketID?: number;
  fileName?: string;
  fileSize?: number;
  contentType?: string;
  data?: string; // Base64 encoded file data
  createDate?: string;
  createdByResourceID?: number;
  [key: string]: any;
}

export interface AutotaskExpenseReport {
  id?: number;
  name?: string;
  submittedByResourceID?: number;
  submitDate?: string;
  approvedDate?: string;
  status?: number;
  totalAmount?: number;
  [key: string]: any;
}

export interface AutotaskExpenseItem {
  id?: number;
  expenseReportID?: number;
  expenseDate?: string;
  description?: string;
  amount?: number;
  billableToAccount?: boolean;
  [key: string]: any;
}

export interface AutotaskQuote {
  id?: number;
  companyID?: number;
  contactID?: number;
  quoteNumber?: string;
  quoteDate?: string;
  title?: string;
  description?: string;
  totalAmount?: number;
  status?: number;
  [key: string]: any;
}

export interface AutotaskBillingCode {
  id?: number;
  name?: string;
  description?: string;
  isActive?: boolean;
  hourlyRate?: number;
  [key: string]: any;
}

export interface AutotaskDepartment {
  id?: number;
  name?: string;
  description?: string;
  isActive?: boolean;
  [key: string]: any;
}

export interface AutotaskUserDefinedField {
  name: string;
  value: string;
}

// API Response wrapper types
export interface AutotaskApiResponse<T> {
  items: T[];
  pageDetails?: {
    count: number;
    requestCount: number;
    prevPageUrl?: string;
    nextPageUrl?: string;
  };
}

export interface AutotaskApiSingleResponse<T> {
  item: T;
}

// Filter and query types that match autotask-node structure
export interface AutotaskQueryOptions {
  filter?: Record<string, any>;
  sort?: string;
  page?: number;
  pageSize?: number;
  // Common search filters (Issue #8 fix)
  searchTerm?: string;
  companyID?: number;
  isActive?: boolean | number;
}

// Extended query options for more advanced queries
export interface AutotaskQueryOptionsExtended extends AutotaskQueryOptions {
  includeFields?: string[];
  excludeFields?: string[];
  expand?: string[];
  submitterId?: number;
  companyId?: number;
  contactId?: number;
  opportunityId?: number;
  searchTerm?: string;
  status?: number;
  assignedResourceID?: number;
  unassigned?: boolean;
  // Date filters for ticket searches
  createdAfter?: string;
  createdBefore?: string;
  lastActivityAfter?: string;
}

// Status enums (commonly used values)
export enum TicketStatus {
  New = 1,
  InProgress = 5,
  Complete = 5,
  WaitingCustomer = 7,
  WaitingVendor = 8,
  Escalated = 9
}

export enum TicketPriority {
  Low = 1,
  Medium = 2,
  High = 3,
  Critical = 4,
  Urgent = 5
}

export enum CompanyType {
  Customer = 1,
  Lead = 2,
  Prospect = 3,
  DeadLead = 4,
  Vendor = 5,
  Partner = 6
} 