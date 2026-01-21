'use strict'

const { eq } = require('drizzle-orm')
const { applicants } = require('../../drizzle/schema')

const applicantsController = {
    getApplicants: async (request, reply) => {
        const { db } = request.server
        const limit = request.query.limit || 10
        const offset = request.query.offset || 0

        const results = await db
            .select()
            .from(applicants)
            .limit(limit)
            .offset(offset)

        return results
    },

    getApplicantById: async (request, reply) => {
        const { db } = request.server
        const { id } = request.params

        const result = await db
            .select()
            .from(applicants)
            .where(eq(applicants.id, id))
            .limit(1)

        if (result.length === 0) {
            return reply.code(404).send({
                error: 'Not found',
                message: 'Applicant not found'
            })
        }

        return result[0]
    },

    createApplicant: async (request, reply) => {
        const { db } = request.server
        const applicantData = request.body

        try {
            const result = await db
                .insert(applicants)
                .values(applicantData)
                .returning()

            return reply.code(201).send(result[0])
        } catch (error) {
            // Handle unique constraint violations (TRN or NIS)
            if (error.code === '23505') {
                // Check which constraint was violated based on error message
                if (error.message && error.message.includes('applicants_TRN_key')) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'TRN already exists',
                        field: 'trn'
                    })
                }
                if (error.message && error.message.includes('applicants_nis_key')) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'NIS already exists',
                        field: 'nis'
                    })
                }
                return reply.code(400).send({
                    error: 'Validation failed',
                    message: 'Unique constraint violation - a record with this value already exists'
                })
            }
            // Handle not null constraint violations
            if (error.code === '23502') {
                const field = error.column || 'unknown'
                return reply.code(400).send({
                    error: 'Validation failed',
                    message: `${field} is required`,
                    field: field
                })
            }
            throw error
        }
    },

    updateApplicant: async (request, reply) => {
        const { db } = request.server
        const { id } = request.params
        const applicantData = request.body

        try {
            const result = await db
                .update(applicants)
                .set(applicantData)
                .where(eq(applicants.id, id))
                .returning()

            if (result.length === 0) {
                return reply.code(404).send({
                    error: 'Not found',
                    message: 'Applicant not found'
                })
            }

            return result[0]
        } catch (error) {
            // Handle unique constraint violations (TRN or NIS)
            if (error.code === '23505') {
                if (error.message && error.message.includes('applicants_TRN_key')) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'TRN already exists',
                        field: 'trn'
                    })
                }
                if (error.message && error.message.includes('applicants_nis_key')) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'NIS already exists',
                        field: 'nis'
                    })
                }
                return reply.code(400).send({
                    error: 'Validation failed',
                    message: 'Unique constraint violation - a record with this value already exists'
                })
            }
            throw error
        }
    }
}

module.exports = applicantsController
