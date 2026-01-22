'use strict'

module.exports = {
  getFieldRegistry: {
    description: 'Get all field registry entries',
    tags: ['field-registry'],
    querystring: {
      type: 'object',
      properties: {
        type: { type: 'string' },
        limit: { type: 'integer', minimum: 1, maximum: 100, default: 10 },
        offset: { type: 'integer', minimum: 0, default: 0 }
      }
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            fieldId: { type: 'string' },
            title: { type: 'string' },
            promptTemplate: { type: 'string' },
            type: { type: 'string' },
            validation: { type: 'object' },
            normalizers: { type: 'object' },
            aliases: { type: 'array' },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  getFieldById: {
    description: 'Get field registry entry by ID',
    tags: ['field-registry'],
    params: {
      type: 'object',
      properties: {
        fieldId: { type: 'string' }
      },
      required: ['fieldId']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          fieldId: { type: 'string' },
          title: { type: 'string' },
          promptTemplate: { type: 'string' },
          type: { type: 'string' },
          validation: { type: 'object' },
          normalizers: { type: 'object' },
          aliases: { type: 'array' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },
  createField: {
    description: 'Create a new field registry entry',
    tags: ['field-registry'],
    body: {
      type: 'object',
      properties: {
        fieldId: { type: 'string' },
        title: { type: 'string' },
        promptTemplate: { type: 'string' },
        type: { type: 'string' },
        validation: { type: 'object' },
        normalizers: { type: 'object' },
        aliases: { type: 'array' }
      },
      required: ['fieldId', 'title', 'promptTemplate', 'type']
    },
    response: {
      201: {
        type: 'object',
        properties: {
          fieldId: { type: 'string' },
          title: { type: 'string' },
          promptTemplate: { type: 'string' },
          type: { type: 'string' },
          validation: { type: 'object' },
          normalizers: { type: 'object' },
          aliases: { type: 'array' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      400: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  },
  updateField: {
    description: 'Update a field registry entry',
    tags: ['field-registry'],
    params: {
      type: 'object',
      properties: {
        fieldId: { type: 'string' }
      },
      required: ['fieldId']
    },
    body: {
      type: 'object',
      properties: {
        title: { type: 'string' },
        promptTemplate: { type: 'string' },
        type: { type: 'string' },
        validation: { type: 'object' },
        normalizers: { type: 'object' },
        aliases: { type: 'array' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          fieldId: { type: 'string' },
          title: { type: 'string' },
          promptTemplate: { type: 'string' },
          type: { type: 'string' },
          validation: { type: 'object' },
          normalizers: { type: 'object' },
          aliases: { type: 'array' },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' }
        }
      },
      404: {
        type: 'object',
        properties: {
          error: { type: 'string' }
        }
      }
    }
  }
}
