'use strict'

module.exports = {
    getFormCriteria: {
        description: 'Get all form criteria',
        tags: ['form-criteria'],
        querystring: {
            type: 'object',
            properties: {
                isActive: { type: 'boolean' },
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
                        formName: { type: 'string' },
                        version: { type: 'integer' },
                        policy: { type: 'object' },
                        isActive: { type: 'boolean' },
                        createdAt: { type: 'string', format: 'date-time' },
                        updatedAt: { type: 'string', format: 'date-time' }
                    }
                }
            }
        }
    },
    getFormCriterionByName: {
        description: 'Get form criterion by name',
        tags: ['form-criteria'],
        params: {
            type: 'object',
            properties: {
                formName: { type: 'string' }
            },
            required: ['formName']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    formName: { type: 'string' },
                    version: { type: 'integer' },
                    policy: { type: 'object' },
                    isActive: { type: 'boolean' },
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
    createFormCriterion: {
        description: 'Create a new form criterion',
        tags: ['form-criteria'],
        body: {
            type: 'object',
            properties: {
                formName: { type: 'string' },
                version: { type: 'integer' },
                policy: { type: 'object' },
                isActive: { type: 'boolean' }
            },
            required: ['formName', 'policy']
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    formName: { type: 'string' },
                    version: { type: 'integer' },
                    policy: { type: 'object' },
                    isActive: { type: 'boolean' },
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
    updateFormCriterion: {
        description: 'Update a form criterion',
        tags: ['form-criteria'],
        params: {
            type: 'object',
            properties: {
                formName: { type: 'string' }
            },
            required: ['formName']
        },
        body: {
            type: 'object',
            properties: {
                version: { type: 'integer' },
                policy: { type: 'object' },
                isActive: { type: 'boolean' }
            }
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    formName: { type: 'string' },
                    version: { type: 'integer' },
                    policy: { type: 'object' },
                    isActive: { type: 'boolean' },
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
    getFormPolicyWithDictionary: {
        description: 'Get form policy with field dictionary',
        tags: ['form-criteria'],
        querystring: {
            type: 'object',
            properties: {
                formName: { type: 'string' }
            },
            required: ['formName']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    policy: { type: 'array' },
                    dictionary: {
                        type: 'object',
                        additionalProperties: {
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
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    }
}
