'use strict'

module.exports = {
  getApplicantFacts: {
    description: 'Get all applicant facts',
    tags: ['applicant-facts'],
    querystring: {
      type: 'object',
      properties: {
        applicantId: { type: 'integer' },
        fieldId: { type: 'string' },
        isCurrent: { type: 'boolean' },
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
            applicantId: { type: 'integer' },
            fieldId: { type: 'string' },
            value: { type: 'object' },
            status: { type: 'string' },
            source: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            isCurrent: { type: 'boolean' }
          }
        }
      }
    }
  },
  getApplicantFactsByApplicant: {
    description: 'Get all facts for a specific applicant',
    tags: ['applicant-facts'],
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
        isCurrent: { type: 'boolean' },
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
            applicantId: { type: 'integer' },
            fieldId: { type: 'string' },
            value: { type: 'object' },
            status: { type: 'string' },
            source: { type: 'string', nullable: true },
            createdAt: { type: 'string', format: 'date-time' },
            updatedAt: { type: 'string', format: 'date-time' },
            isCurrent: { type: 'boolean' }
          }
        }
      }
    }
  },
  getApplicantFactById: {
    description: 'Get applicant fact by ID',
    tags: ['applicant-facts'],
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
          applicantId: { type: 'integer' },
          fieldId: { type: 'string' },
          value: { type: 'object' },
          status: { type: 'string' },
          source: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          isCurrent: { type: 'boolean' }
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
  createApplicantFact: {
    description: 'Create a new applicant fact',
    tags: ['applicant-facts'],
    body: {
      type: 'object',
      properties: {
        applicantId: { type: 'integer' },
        fieldId: { type: 'string' },
        value: { type: 'object' },
        status: { type: 'string' },
        source: { type: 'string' },
        isCurrent: { type: 'boolean' }
      },
      required: ['applicantId', 'fieldId', 'value']
    },
    response: {
      201: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          applicantId: { type: 'integer' },
          fieldId: { type: 'string' },
          value: { type: 'object' },
          status: { type: 'string' },
          source: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          isCurrent: { type: 'boolean' }
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
  updateApplicantFact: {
    description: 'Update an applicant fact',
    tags: ['applicant-facts'],
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
        value: { type: 'object' },
        status: { type: 'string' },
        source: { type: 'string' },
        isCurrent: { type: 'boolean' }
      }
    },
    response: {
      200: {
        type: 'object',
        properties: {
          id: { type: 'integer' },
          applicantId: { type: 'integer' },
          fieldId: { type: 'string' },
          value: { type: 'object' },
          status: { type: 'string' },
          source: { type: 'string', nullable: true },
          createdAt: { type: 'string', format: 'date-time' },
          updatedAt: { type: 'string', format: 'date-time' },
          isCurrent: { type: 'boolean' }
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
