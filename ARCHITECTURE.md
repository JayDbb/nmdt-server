# Project Architecture

This project follows a modular architecture pattern where each resource/feature is self-contained in its own module folder.

## Folder Structure

```
├── modules/          # Feature modules (each module is self-contained)
│   └── applicants/  # Example: Applicants module
│       ├── index.js      # Route registration with prefix
│       ├── controller.js # Business logic
│       └── schema.js     # API validation schemas
├── plugins/          # Fastify plugins (db, swagger, etc.)
└── drizzle/          # Database schema definitions
```

## Architecture Pattern

Each module is self-contained with its own:
- **schema.js** - API validation schemas (request/response)
- **controller.js** - Business logic and request handlers
- **index.js** - Route definitions that register endpoints with a prefix

### Example Module Structure: `modules/applicants/`

**1. Schema (`schema.js`)**
Contains JSON schema definitions for request validation and Swagger documentation.

```javascript
module.exports = {
  getApplicants: {
    description: 'Get all applicants',
    tags: ['applicants'],
    querystring: { /* ... */ },
    response: { /* ... */ }
  }
}
```

**2. Controller (`controller.js`)**
Contains business logic and handles request/response.

```javascript
const applicantsController = {
  getApplicants: async (request, reply) => {
    const { db } = request.server
    // Business logic here
    return results
  }
}
```

**3. Routes (`index.js`)**
Defines endpoints and wires schemas to controllers. Uses Fastify's prefix option to register routes.

```javascript
const applicantsSchemas = require('./schema')
const applicantsController = require('./controller')

module.exports = async function (fastify, opts) {
  await fastify.register(async function (fastify) {
    fastify.get('/', {
      schema: applicantsSchemas.getApplicants
    }, applicantsController.getApplicants)
  }, { prefix: '/applicants' })
}
```

## Benefits

- **Separation of Concerns**: Each layer has a single responsibility
- **Reusability**: Schemas and controllers can be reused across routes
- **Testability**: Easy to test controllers and schemas independently
- **Maintainability**: Clear structure makes code easier to understand and modify
- **Documentation**: Schemas automatically generate Swagger documentation

## Adding New Modules

1. **Create module folder** `modules/yourResource/`
2. **Create `schema.js`** with API validation schemas
3. **Create `controller.js`** with business logic
4. **Create `index.js`** that registers routes with prefix
5. **Update Swagger** tags in `plugins/swagger.js` (if needed)

The module will be automatically loaded by Fastify's AutoLoad from the `modules/` directory.
