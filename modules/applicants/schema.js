'use strict'

module.exports = {
    getApplicants: {
        description: 'Get all applicants',
        tags: ['applicants'],
        querystring: {
            type: 'object',
            properties: {
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
                }
            }
        }
    },
    getApplicantById: {
        description: 'Get applicant by ID',
        tags: ['applicants'],
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
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    },
    createApplicant: {
        description: 'Create a new applicant',
        tags: ['applicants'],
        body: {
            type: 'object',
            properties: {
                nis: { type: 'string' },
                phone: { type: 'string' },
                fullName: { type: 'string' },
                trn: { type: 'string' },
                address: { type: 'string' },
                constituency: { type: 'string' },
                division: { type: 'string' },
                votersIdPath: { type: 'string' },
                dob: { type: 'string', format: 'date' },
                gender: { type: 'string' },
                consentTimestamp: { type: 'string', format: 'date' }
            },
            required: ['consentTimestamp']
        },
        response: {
            201: {
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
            400: {
                type: 'object',
                properties: {
                    error: { type: 'string' },
                    message: { type: 'string' },
                    field: { type: 'string' },
                    details: { type: 'array', items: { type: 'object', properties: { field: { type: 'string' }, message: { type: 'string' } } } }
                }
            }
        }
    },
    updateApplicant: {
        description: 'Update an applicant',
        tags: ['applicants'],
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
                nis: { type: 'string' },
                phone: { type: 'string' },
                fullName: { type: 'string' },
                trn: { type: 'string' },
                address: { type: 'string' },
                constituency: { type: 'string' },
                division: { type: 'string' },
                votersIdPath: { type: 'string' },
                dob: { type: 'string', format: 'date' },
                gender: { type: 'string' },
                consentTimestamp: { type: 'string', format: 'date' }
            }
        },
        response: {
            200: {
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
            404: {
                type: 'object',
                properties: {
                    error: { type: 'string' }
                }
            }
        }
    },
    deleteApplicant: {
        description: 'Delete an applicant',
        tags: ['applicants'],
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
                    message: { type: 'string' }
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
