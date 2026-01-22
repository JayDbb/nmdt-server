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
    },
    submitApplication: {
        description: 'Submit a complete application with applicant data and form responses',
        tags: ['applications'],
        body: {
            type: 'object',
            properties: {
                formId: { type: 'string' },
                applicantId: { type: 'integer' },
                applicantData: {
                    type: 'object',
                    properties: {
                        consentTimestamp: { type: 'string', format: 'date' },
                        nis: { type: 'string' },
                        phone: { type: 'string' },
                        fullName: { type: 'string' },
                        trn: { type: 'string' },
                        address: { type: 'string' },
                        constituency: { type: 'string' },
                        division: { type: 'string' },
                        votersIdPath: { type: 'string' },
                        dob: { type: 'string', format: 'date' },
                        gender: { type: 'string' }
                    },
                    required: ['consentTimestamp']
                },
                formData: {
                    type: 'object',
                    description: 'Object where keys are field_ids and values are the field values',
                    additionalProperties: true
                },
                status: { type: 'string' }
            },
            required: ['formId']
        },
        response: {
            201: {
                type: 'object',
                properties: {
                    application: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            createdAt: { type: 'string', format: 'date-time' },
                            formId: { type: 'string', nullable: true },
                            applicants: { type: 'integer', nullable: true },
                            status: { type: 'string', nullable: true }
                        }
                    },
                    applicant: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            createdAt: { type: 'string', format: 'date-time' },
                            nis: { type: 'string', nullable: true },
                            phone: { type: 'string', nullable: true },
                            fullName: { type: 'string', nullable: true },
                            trn: { type: 'string', nullable: true },
                            address: { type: 'string', nullable: true },
                            constituency: { type: 'string', nullable: true },
                            division: { type: 'string', nullable: true },
                            votersIdPath: { type: 'string', nullable: true },
                            dob: { type: 'string', format: 'date', nullable: true },
                            gender: { type: 'string', nullable: true },
                            consentTimestamp: { type: 'string', format: 'date' }
                        }
                    },
                    facts: {
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
                    },
                    existingFacts: {
                        type: 'array',
                        description: 'Existing applicant facts found for required fields',
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
                    },
                    requiredFields: {
                        type: 'array',
                        description: 'Field IDs extracted from form policy required_fields',
                        items: { type: 'string' }
                    },
                    summary: {
                        type: 'object',
                        properties: {
                            factsCreated: { type: 'integer' },
                            factsErrors: { type: 'integer' },
                            existingFactsFound: { type: 'integer' }
                        }
                    }
                }
            },
            400: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                    details: { type: 'array' }
                }
            }
        }
    },
    getApplicationFormData: {
        description: 'Get the form submission data for an applicant (combines applicant personal data and applicant facts for form\'s required fields)',
        tags: ['applications'],
        querystring: {
            type: 'object',
            properties: {
                formId: { type: 'string' },
                applicantId: { type: 'integer' }
            },
            required: ['formId', 'applicantId']
        },
        response: {
            200: {
                type: 'object',
                properties: {
                    formId: { type: 'string' },
                    applicantId: { type: 'integer' },
                    applicant: {
                        type: 'object',
                        properties: {
                            id: { type: 'integer' },
                            createdAt: { type: 'string', format: 'date-time' },
                            nis: { type: 'string', nullable: true },
                            phone: { type: 'string', nullable: true },
                            fullName: { type: 'string', nullable: true },
                            trn: { type: 'string', nullable: true },
                            address: { type: 'string', nullable: true },
                            constituency: { type: 'string', nullable: true },
                            division: { type: 'string', nullable: true },
                            votersIdPath: { type: 'string', nullable: true },
                            dob: { type: 'string', format: 'date', nullable: true },
                            gender: { type: 'string', nullable: true },
                            consentTimestamp: { type: 'string', format: 'date' }
                        }
                    },
                    requiredFields: {
                        type: 'array',
                        items: { type: 'string' }
                    },
                    existingFacts: {
                        type: 'object',
                        description: 'Object where keys are field_ids and values are applicant fact objects',
                        additionalProperties: {
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
                    },
                    formData: {
                        type: 'object',
                        description: 'Simplified object with field_id -> value mapping from applicant facts',
                        additionalProperties: true
                    },
                    submissionData: {
                        type: 'object',
                        description: 'Combined view of form submission data (formData + applicant data)',
                        additionalProperties: true
                    }
                }
            },
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' }
                }
            }
        }
    }
}
