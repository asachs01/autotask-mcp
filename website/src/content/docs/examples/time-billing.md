---
title: Time & Billing
description: Example prompts for logging time entries and viewing financial data.
---

## Creating Time Entries

### Log time against a ticket

**Prompt:**
> "Log 1.5 hours on ticket 48231 with summary 'Troubleshot email server connectivity, restarted services'"

**What happens:** The server calls `autotask_create_time_entry` with `ticketID: 48231`, `hoursWorked: 1.5`, and `summaryNotes: "Troubleshot email server connectivity, restarted services"`.

**Expected output:**
```json
{
  "message": "Created time entry with ID: 92001",
  "data": 92001
}
```

### Log time with a specific date

**Prompt:**
> "Create a time entry for ticket 48231: 2 hours on 2024-01-15, summary 'Initial diagnostics and vendor escalation'"

**What happens:** The server calls `autotask_create_time_entry` with `ticketID: 48231`, `hoursWorked: 2`, `dateWorked: "2024-01-15"`, and `summaryNotes: "Initial diagnostics and vendor escalation"`.

### Log time with resource and role

**Prompt:**
> "Log 0.5 hours on ticket 48231 for resource 12345 with role ID 3"

**What happens:** The server calls `autotask_create_time_entry` with `ticketID: 48231`, `hoursWorked: 0.5`, `resourceID: 12345`, and `roleID: 3`.

---

## Expense Reports

### Search expense reports

**Prompt:**
> "Show me recent expense reports"

**What happens:** The server calls `autotask_search_expense_reports`.

**Expected output:**
```json
{
  "summary": "Found 3 expense reports (showing 1-3)",
  "items": [
    {
      "id": 1001,
      "name": "January Travel Expenses",
      "submitterID": 12345,
      "status": 2,
      "total": 450.00,
      "_enhanced": {
        "submitterName": "John Smith"
      }
    }
  ],
  "total": 3
}
```

### Create an expense report

**Prompt:**
> "Create an expense report called 'Q1 Training Expenses' for resource 12345"

**What happens:** The server calls `autotask_create_expense_report` with `name: "Q1 Training Expenses"` and `submitterID: 12345`.

---

## Contracts

### Search contracts

**Prompt:**
> "Show contracts for company 29683451"

**What happens:** The server calls `autotask_search_contracts` with `companyID: 29683451`.

**Expected output:**
```json
{
  "summary": "Found 2 contracts (showing 1-2)",
  "items": [
    {
      "id": 6001,
      "contractName": "Managed Services Agreement",
      "contractType": 3,
      "status": 1,
      "startDate": "2024-01-01",
      "endDate": "2024-12-31",
      "companyID": 29683451,
      "_enhanced": {
        "companyName": "Northwind Traders"
      }
    }
  ],
  "total": 2
}
```

---

## Invoices

### Search invoices

**Prompt:**
> "Find invoices for company 29683451"

**What happens:** The server calls `autotask_search_invoices` with `companyID: 29683451`.

**Expected output:**
```json
{
  "summary": "Found 4 invoices (showing 1-4)",
  "items": [
    {
      "id": 8001,
      "invoiceNumber": "INV-2024-0042",
      "invoiceDate": "2024-01-31",
      "totalAmount": 2500.00,
      "companyID": 29683451,
      "_enhanced": {
        "companyName": "Northwind Traders"
      }
    }
  ],
  "total": 4
}
```

---

## Quotes

### Search quotes

**Prompt:**
> "Show me quotes for company 29683451"

**What happens:** The server calls `autotask_search_quotes` with `companyID: 29683451`.

### Create a quote

**Prompt:**
> "Create a quote named 'Firewall Hardware' for company 29683451"

**What happens:** The server calls `autotask_create_quote` with `name: "Firewall Hardware"` and `companyID: 29683451`.

**Expected output:**
```json
{
  "message": "Created quote with ID: 9010",
  "data": 9010
}
```
