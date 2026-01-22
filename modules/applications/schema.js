'use strict'

module.exports = {
  getApplications: {
    description: 'Get all applications',
    tags: ['applications'],
    querystring: {
      type: 'object',
      properties: {
        applicantId: { type: 'integer' },
        formId: { type: 'string' },
        status: { type: 'string' },
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
            id: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            formId: { type: 'string', nullable: true },
            applicants: { type: 'integer', nullable: true },
            status: { type: 'string', nullable: true }
          }
        }
      }
    }
  },
  getApplicationById: {
    description: 'Get application by ID',
    tags: ['applications'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' }
      },
      required: ['id']
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          formId: { type: 'string', nullable: true },
          applicants: { type: 'integer', nullable: true },
          status: { type: 'string', nullable: true }
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
  getApplicationsByApplicant: {
    description: 'Get all applications for a specific applicant',
    tags: ['applications'],
    params: {
      type: 'object',
      properties: {
        applicantId: { type: 'integer' }
      },
      required: ['applicantId']
    },
    querystring: {
      type: 'object',
      properties: {
        status: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            createdAt: { type: 'string', format: 'date-time' },
            formId: { type: 'string', nullable: true },
            applicants: { type: 'integer', nullable: true },
            status: { type: 'string', nullable: true }
          }
        }
      }
    }
  },
  createApplication: {
    description: 'Create a new application',
    tags: ['applications'],
    body: {
      type: 'object',
      properties: {
        formId: { type: 'string' },
        applicants: { type: 'integer' },
        status: { type: 'string' }
      },
      required: []
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          formId: { type: 'string', nullable: true },
          applicants: { type: 'integer', nullable: true },
          status: { type: 'string', nullable: true }
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
  updateApplication: {
    description: 'Update an application',
    tags: ['applications'],
    params: {
      type: 'object',
      properties: {
        id: { type: 'integer' }
      },
      required: ['id']
    },
    body: {
      type: 'object',
      properties: {
        formId: { type: 'string' },
        applicants: { type: 'integer' },
        status: { type: 'string' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          createdAt: { type: 'string', format: 'date-time' },
          formId: { type: 'string', nullable: true },
          applicants: { type: 'integer', nullable: true },
          status: { type: 'string', nullable: true }
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
