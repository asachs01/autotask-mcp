---
title: Companies & Contacts
description: Example prompts for searching and managing companies and contacts.
---

## Searching Companies

### Find a company by name

**Prompt:**
> "Search for the company Northwind Traders"

**What happens:** The server calls `autotask_search_companies` with `searchTerm: "Northwind Traders"`.

**Expected output:**
```json
{
  "summary": "Found 1 companies (showing 1-1)",
  "items": [
    {
      "id": 29683451,
      "companyName": "Northwind Traders",
      "phone": "555-0100",
      "companyType": 1,
      "isActive": true,
      "_enhanced": {
        "companyName": "Northwind Traders"
      }
    }
  ],
  "total": 1
}
```

### List all active companies

**Prompt:**
> "Show me all active companies in Autotask"

**What happens:** The server calls `autotask_search_companies` with `isActive: true`.

**Expected output:** A paginated list of companies with IDs, names, and phone numbers. Results are returned in pages of 25 by default.

---

## Creating Companies

### Create a new company

**Prompt:**
> "Create a new company called Summit Solutions with phone number 555-0200"

**What happens:** The server calls `autotask_create_company` with `companyName: "Summit Solutions"` and `phone: "555-0200"`.

**Expected output:**
```json
{
  "message": "Created company with ID: 29683890",
  "data": 29683890
}
```

---

## Updating Companies

### Update company phone number

**Prompt:**
> "Update the phone number for company ID 29683451 to 555-0300"

**What happens:** The server calls `autotask_update_company` with `id: 29683451` and `phone: "555-0300"`.

**Expected output:**
```json
{
  "message": "Updated company 29683451 successfully",
  "data": { "id": 29683451 }
}
```

---

## Searching Contacts

### Find contacts at a company

**Prompt:**
> "Show me contacts at company ID 29683451"

**What happens:** The server calls `autotask_search_contacts` with `companyID: 29683451`.

**Expected output:**
```json
{
  "summary": "Found 3 contacts (showing 1-3)",
  "items": [
    {
      "id": 30412,
      "firstName": "Alice",
      "lastName": "Johnson",
      "emailAddress": "alice.johnson@example.com",
      "phone": "555-0101",
      "isActive": true,
      "_enhanced": {
        "companyName": "Northwind Traders"
      }
    }
  ],
  "total": 3
}
```

### Search contacts by name

**Prompt:**
> "Find the contact named Bob Martinez"

**What happens:** The server calls `autotask_search_contacts` with `searchTerm: "Bob Martinez"`.

---

## Creating Contacts

### Add a new contact

**Prompt:**
> "Create a contact named Carol Davis with email carol@example.com at company ID 29683451"

**What happens:** The server calls `autotask_create_contact` with `firstName: "Carol"`, `lastName: "Davis"`, `emailAddress: "carol@example.com"`, and `companyID: 29683451`.

**Expected output:**
```json
{
  "message": "Created contact with ID: 30415",
  "data": 30415
}
```
