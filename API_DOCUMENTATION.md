# NMDT Server API Documentation

Complete API documentation for the NMDT (National Management and Data Tracking) Server.

## Table of Contents

- [Base URL](#base-url)
- [Authentication](#authentication)
- [Error Handling](#error-handling)
- [Data Models](#data-models)
- [Endpoints](#endpoints)
  - [Applicants](#applicants)
  - [Applicant Facts](#applicant-facts)
  - [Applications](#applications)
  - [Form Criteria](#form-criteria)
  - [Field Registry](#field-registry)
- [Common Workflows](#common-workflows)
- [Swagger UI](#swagger-ui)

---

## Base URL

**Development:** `http://localhost:3000`  
**Production:** `https://your-production-url.com`

All endpoints are prefixed with the base URL.

---

## Authentication

Currently, the API does not require authentication. All endpoints are publicly accessible.

---

## Error Handling

### Error Response Format

All errors follow a consistent format:

```json
{
  "error": "Error Type",
  "message": "Human-readable error message",
  "details": [
    {
      "field": "fieldName",
      "message": "Specific field error message"
    }
  ]
}
```

### HTTP Status Codes

- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `404` - Not Found
- `500` - Internal Server Error

### Validation Errors

When validation fails, you'll receive a `400` status with detailed field-level errors:

```json
{
  "error": "Validation failed",
  "message": "One or more fields failed validation",
  "details": [
    {
      "field": "consentTimestamp",
      "message": "consentTimestamp is required"
    },
    {
      "field": "dob",
      "message": "dob must be a valid date (e.g., YYYY-MM-DD)"
    }
  ]
}
```

### Database Constraint Errors

Unique constraint violations return specific messages:

```json
{
  "error": "Validation failed",
  "message": "TRN already exists",
  "field": "trn"
}
```

---

## Data Models

### Applicant

```typescript
{
  id: number                    // Auto-generated
  createdAt: string            // ISO 8601 timestamp
  nis: string | null           // NIS number
  phone: string | null        // Phone number (numeric)
  fullName: string | null     // Full name
  trn: string | null           // TRN number (unique)
  address: string | null       // Address
  constituency: string | null  // Constituency
  division: string | null      // Division
  votersIdPath: string | null // Path to voter's ID document
  dob: string | null           // Date of birth (YYYY-MM-DD)
  gender: string | null       // Gender
  consentTimestamp: string    // Required: Consent date (YYYY-MM-DD)
}
```

### Applicant Fact

```typescript
{
  id: number                   // Auto-generated
  applicantId: number          // Foreign key to applicants.id
  fieldId: string              // Field identifier (e.g., "applicant.full_name")
  value: object                // JSONB value (any JSON structure)
  status: string               // Default: "provided"
  source: string | null        // Source of the data
  createdAt: string            // ISO 8601 timestamp
  updatedAt: string            // ISO 8601 timestamp
  isCurrent: boolean          // Default: true (only one current per applicant/field)
}
```

### Application

```typescript
{
  id: number                   // Auto-generated
  createdAt: string            // ISO 8601 timestamp
  formId: string | null        // Foreign key to form_criteria.form_name
  applicants: number | null    // Foreign key to applicants.id
  status: string | null        // Application status
}
```

### Form Criterion

```typescript
{
  formName: string             // Primary key
  version: number              // Default: 1
  policy: object               // JSONB policy object
  isActive: boolean           // Default: true
  createdAt: string           // ISO 8601 timestamp
  updatedAt: string           // ISO 8601 timestamp
}
```

### Field Registry

```typescript
{
  fieldId: string             // Primary key
  title: string               // Field title
  promptTemplate: string      // Prompt template
  type: string                // Field type
  validation: object           // JSONB validation rules (default: {})
  normalizers: object         // JSONB normalizers (default: {})
  aliases: array              // JSONB aliases array (default: [])
  createdAt: string           // ISO 8601 timestamp
  updatedAt: string           // ISO 8601 timestamp
}
```

---

## Endpoints

### Applicants

#### Get All Applicants

```http
GET /applicants?limit=10&offset=0
```

**Query Parameters:**
- `limit` (integer, 1-100, default: 10) - Number of results
- `offset` (integer, default: 0) - Number of results to skip

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "nis": "123456",
    "phone": "1234567890",
    "fullName": "John Doe",
    "trn": "987654321",
    "address": "123 Main St",
    "constituency": "Kingston",
    "division": "Central",
    "votersIdPath": "/uploads/voter-id-123.pdf",
    "dob": "1990-01-01",
    "gender": "Male",
    "consentTimestamp": "2024-01-15"
  }
]
```

#### Get Applicant by ID

```http
GET /applicants/:id
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "createdAt": "2024-01-15T10:30:00Z",
  "nis": "123456",
  "phone": "1234567890",
  "fullName": "John Doe",
  "trn": "987654321",
  "address": "123 Main St",
  "constituency": "Kingston",
  "division": "Central",
  "votersIdPath": "/uploads/voter-id-123.pdf",
  "dob": "1990-01-01",
  "gender": "Male",
  "consentTimestamp": "2024-01-15"
}
```

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Applicant not found"
}
```

#### Create Applicant

```http
POST /applicants
Content-Type: application/json
```

**Request Body:**
```json
{
  "consentTimestamp": "2024-01-15",
  "nis": "123456",
  "phone": "1234567890",
  "fullName": "John Doe",
  "trn": "987654321",
  "address": "123 Main St",
  "constituency": "Kingston",
  "division": "Central",
  "votersIdPath": "/uploads/voter-id-123.pdf",
  "dob": "1990-01-01",
  "gender": "Male"
}
```

**Required Fields:**
- `consentTimestamp` (string, format: YYYY-MM-DD)

**Response:** `201 Created`
```json
{
  "id": 1,
  "createdAt": "2024-01-15T10:30:00Z",
  "nis": "123456",
  "phone": "1234567890",
  "fullName": "John Doe",
  "trn": "987654321",
  "address": "123 Main St",
  "constituency": "Kingston",
  "division": "Central",
  "votersIdPath": "/uploads/voter-id-123.pdf",
  "dob": "1990-01-01",
  "gender": "Male",
  "consentTimestamp": "2024-01-15"
}
```

**Error:** `400 Bad Request`
```json
{
  "error": "Validation failed",
  "message": "TRN already exists",
  "field": "trn"
}
```

#### Update Applicant

```http
PUT /applicants/:id
Content-Type: application/json
```

**Request Body:** (all fields optional)
```json
{
  "fullName": "Jane Doe",
  "phone": "0987654321"
}
```

**Response:** `200 OK` - Returns updated applicant object

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Applicant not found"
}
```

---

### Applicant Facts

#### Get All Applicant Facts

```http
GET /applicant-facts?applicantId=1&fieldId=applicant.full_name&isCurrent=true&status=provided&limit=10&offset=0
```

**Query Parameters:**
- `applicantId` (integer) - Filter by applicant ID
- `fieldId` (string) - Filter by field ID
- `isCurrent` (boolean) - Filter by current status
- `status` (string) - Filter by status
- `limit` (integer, 1-100, default: 10)
- `offset` (integer, default: 0)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "applicantId": 1,
    "fieldId": "applicant.full_name",
    "value": { "raw": "John Doe" },
    "status": "provided",
    "source": "form_submission",
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z",
    "isCurrent": true
  }
]
```

#### Get Facts by Applicant

```http
GET /applicant-facts/applicant/:applicantId?isCurrent=true&status=provided
```

**Query Parameters:**
- `isCurrent` (boolean) - Only get current facts
- `status` (string) - Filter by status

**Response:** `200 OK` - Array of applicant fact objects

#### Get Applicant Fact by ID

```http
GET /applicant-facts/:id
```

**Response:** `200 OK` - Single applicant fact object

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Applicant fact not found"
}
```

#### Create Applicant Fact

```http
POST /applicant-facts
Content-Type: application/json
```

**Request Body:**
```json
{
  "applicantId": 1,
  "fieldId": "applicant.full_name",
  "value": { "raw": "John Doe" },
  "status": "provided",
  "source": "form_submission",
  "isCurrent": true
}
```

**Required Fields:**
- `applicantId` (integer)
- `fieldId` (string)
- `value` (object) - Any JSON object

**Response:** `201 Created` - Returns created fact object

**Error:** `400 Bad Request`
```json
{
  "error": "Validation failed",
  "message": "Applicant not found",
  "field": "applicantId"
}
```

**Note:** When creating a fact with `isCurrent: true`, any existing current fact for the same applicant/field will be automatically set to `isCurrent: false`.

#### Update Applicant Fact

```http
PUT /applicant-facts/:id
Content-Type: application/json
```

**Request Body:** (all fields optional)
```json
{
  "value": { "raw": "Jane Doe" },
  "status": "verified",
  "source": "manual_review",
  "isCurrent": true
}
```

**Response:** `200 OK` - Returns updated fact object

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Applicant fact not found"
}
```

---

### Applications

#### Get All Applications

```http
GET /applications?applicantId=1&formId=form-name&status=pending&limit=10&offset=0
```

**Query Parameters:**
- `applicantId` (integer) - Filter by applicant ID
- `formId` (string) - Filter by form ID
- `status` (string) - Filter by status
- `limit` (integer, 1-100, default: 10)
- `offset` (integer, default: 0)

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "createdAt": "2024-01-15T10:30:00Z",
    "formId": "Solidarity Programme Attestation Form – Low-Income Informal Worker",
    "applicants": 1,
    "status": "pending"
  }
]
```

#### Get Application by ID

```http
GET /applications/:id
```

**Response:** `200 OK` - Single application object

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Application not found"
}
```

#### Get Applications by Applicant

```http
GET /applications/applicant/:applicantId?status=pending
```

**Query Parameters:**
- `status` (string) - Filter by status

**Response:** `200 OK` - Array of application objects

#### Create Application

```http
POST /applications
Content-Type: application/json
```

**Request Body:**
```json
{
  "formId": "Solidarity Programme Attestation Form – Low-Income Informal Worker",
  "applicants": 1,
  "status": "pending"
}
```

**All fields are optional**, but typically you'll want to provide:
- `formId` (string) - Form name
- `applicants` (integer) - Applicant ID
- `status` (string) - Application status

**Response:** `201 Created` - Returns created application object

**Error:** `400 Bad Request`
```json
{
  "error": "Validation failed",
  "message": "Applicant not found",
  "field": "applicants"
}
```

#### Update Application

```http
PUT /applications/:id
Content-Type: application/json
```

**Request Body:** (all fields optional)
```json
{
  "status": "approved",
  "formId": "Updated Form Name"
}
```

**Response:** `200 OK` - Returns updated application object

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Application not found"
}
```

---

### Form Criteria

#### Get All Form Criteria

```http
GET /form-criteria?isActive=true&limit=10&offset=0
```

**Query Parameters:**
- `isActive` (boolean) - Filter by active status
- `limit` (integer, 1-100, default: 10)
- `offset` (integer, default: 0)

**Response:** `200 OK`
```json
[
  {
    "formName": "Solidarity Programme Attestation Form – Low-Income Informal Worker",
    "version": 1,
    "policy": {
      "notes": ["..."],
      "required_fields": [...],
      "eligibility_rules": [],
      "required_documents": []
    },
    "isActive": true,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Form Criterion by Name

```http
GET /form-criteria/:formName
```

**Note:** The form name should be URL-encoded if it contains spaces or special characters.

**Response:** `200 OK` - Single form criterion object

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Form criterion not found"
}
```

#### Get Form Policy with Dictionary

```http
GET /form-criteria/policy?formName=Solidarity Programme Attestation Form – Low-Income Informal Worker
```

**Query Parameters:**
- `formName` (string, required) - The form name (can contain spaces and special characters)

**Response:** `200 OK`
```json
{
  "policy": {
    "notes": [
      "This form must be completed for applicants applying as low-income informal workers."
    ],
    "required_fields": [
      {
        "field_id": "applicant.full_name",
        "required": true
      },
      {
        "field_id": "applicant.date_of_birth",
        "required": true
      }
    ],
    "eligibility_rules": [],
    "required_documents": []
  },
  "dictionary": {
    "applicant.full_name": {
      "fieldId": "applicant.full_name",
      "title": "Full Name",
      "promptTemplate": "Enter your full name",
      "type": "text",
      "validation": {},
      "normalizers": {},
      "aliases": [],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    },
    "applicant.date_of_birth": {
      "fieldId": "applicant.date_of_birth",
      "title": "Date of Birth",
      "promptTemplate": "Enter your date of birth",
      "type": "date",
      "validation": {},
      "normalizers": {},
      "aliases": [],
      "createdAt": "2024-01-15T10:30:00Z",
      "updatedAt": "2024-01-15T10:30:00Z"
    }
  }
}
```

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Form criterion not found"
}
```

#### Create Form Criterion

```http
POST /form-criteria
Content-Type: application/json
```

**Request Body:**
```json
{
  "formName": "New Form Name",
  "version": 1,
  "policy": {
    "notes": ["Form notes"],
    "required_fields": [
      {
        "field_id": "applicant.full_name",
        "required": true
      }
    ],
    "eligibility_rules": [],
    "required_documents": []
  },
  "isActive": true
}
```

**Required Fields:**
- `formName` (string)
- `policy` (object)

**Response:** `201 Created` - Returns created form criterion object

**Error:** `400 Bad Request`
```json
{
  "error": "Validation failed",
  "message": "Form criterion with this name already exists",
  "field": "formName"
}
```

#### Update Form Criterion

```http
PUT /form-criteria/:formName
Content-Type: application/json
```

**Request Body:** (all fields optional)
```json
{
  "version": 2,
  "policy": { /* updated policy */ },
  "isActive": false
}
```

**Response:** `200 OK` - Returns updated form criterion object

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Form criterion not found"
}
```

---

### Field Registry

#### Get All Field Registry Entries

```http
GET /field-registry?type=text&limit=10&offset=0
```

**Query Parameters:**
- `type` (string) - Filter by field type
- `limit` (integer, 1-100, default: 10)
- `offset` (integer, default: 0)

**Response:** `200 OK`
```json
[
  {
    "fieldId": "applicant.full_name",
    "title": "Full Name",
    "promptTemplate": "Enter your full name",
    "type": "text",
    "validation": {},
    "normalizers": {},
    "aliases": [],
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  }
]
```

#### Get Field by ID

```http
GET /field-registry/:fieldId
```

**Response:** `200 OK` - Single field registry object

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Field registry entry not found"
}
```

#### Create Field Registry Entry

```http
POST /field-registry
Content-Type: application/json
```

**Request Body:**
```json
{
  "fieldId": "applicant.full_name",
  "title": "Full Name",
  "promptTemplate": "Enter your full name",
  "type": "text",
  "validation": {},
  "normalizers": {},
  "aliases": []
}
```

**Required Fields:**
- `fieldId` (string)
- `title` (string)
- `promptTemplate` (string)
- `type` (string)

**Response:** `201 Created` - Returns created field registry object

**Error:** `400 Bad Request`
```json
{
  "error": "Validation failed",
  "message": "Field registry entry with this ID already exists",
  "field": "fieldId"
}
```

#### Update Field Registry Entry

```http
PUT /field-registry/:fieldId
Content-Type: application/json
```

**Request Body:** (all fields optional except fieldId)
```json
{
  "title": "Updated Title",
  "promptTemplate": "Updated prompt",
  "type": "text",
  "validation": { "required": true },
  "normalizers": { "trim": true },
  "aliases": ["name", "fullname"]
}
```

**Response:** `200 OK` - Returns updated field registry object

**Error:** `404 Not Found`
```json
{
  "error": "Not found",
  "message": "Field registry entry not found"
}
```

---

## Common Workflows

### 1. Create an Applicant and Submit Form Data

```javascript
// Step 1: Create applicant
const applicant = await fetch('http://localhost:3000/applicants', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    consentTimestamp: '2024-01-15',
    fullName: 'John Doe',
    trn: '987654321'
  })
}).then(r => r.json())

// Step 2: Get form policy to know which fields are required
const formPolicy = await fetch(
  'http://localhost:3000/form-criteria/policy?formName=Solidarity Programme Attestation Form – Low-Income Informal Worker'
).then(r => r.json())

// Step 3: Submit form data as applicant facts
const facts = Object.entries(formData).map(([fieldId, value]) => ({
  applicantId: applicant.id,
  fieldId,
  value: { raw: value },
  status: 'provided',
  source: 'form_submission'
}))

// Submit each fact
for (const fact of facts) {
  await fetch('http://localhost:3000/applicant-facts', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(fact)
  })
}

// Step 4: Create application record
const application = await fetch('http://localhost:3000/applications', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    formId: 'Solidarity Programme Attestation Form – Low-Income Informal Worker',
    applicants: applicant.id,
    status: 'pending'
  })
}).then(r => r.json())
```

### 2. Get Complete Applicant Data with Facts

```javascript
// Get applicant
const applicant = await fetch(`http://localhost:3000/applicants/${applicantId}`)
  .then(r => r.json())

// Get all current facts for applicant
const facts = await fetch(
  `http://localhost:3000/applicant-facts/applicant/${applicantId}?isCurrent=true`
).then(r => r.json())

// Combine into single object
const applicantWithFacts = {
  ...applicant,
  facts: facts.reduce((acc, fact) => {
    acc[fact.fieldId] = fact
    return acc
  }, {})
}
```

### 3. Update Multiple Facts for an Applicant

```javascript
// Get current facts
const currentFacts = await fetch(
  `http://localhost:3000/applicant-facts/applicant/${applicantId}?isCurrent=true`
).then(r => r.json())

// Update each fact
for (const fact of currentFacts) {
  await fetch(`http://localhost:3000/applicant-facts/${fact.id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      value: { raw: updatedValue },
      status: 'verified'
    })
  })
}
```

### 4. Get All Applications for an Applicant

```javascript
const applications = await fetch(
  `http://localhost:3000/applications/applicant/${applicantId}`
).then(r => r.json())
```

---

## Swagger UI

Interactive API documentation is available at:

**http://localhost:3000/documentation**

The Swagger UI provides:
- Complete endpoint documentation
- Request/response schemas
- Try-it-out functionality
- Example requests and responses

---

## CORS

The API supports CORS and handles OPTIONS preflight requests automatically. All origins are currently allowed in development.

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider implementing rate limiting for production use.

---

## Support

For issues or questions, please refer to:
- Swagger UI: `http://localhost:3000/documentation`
- Project README: [README.md](./README.md)
- Architecture Documentation: [ARCHITECTURE.md](./ARCHITECTURE.md)
