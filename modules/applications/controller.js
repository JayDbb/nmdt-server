'use strict'

const { eq, and, inArray } = require('drizzle-orm')
const { applications, applicants, applicantFacts, formCriteria } = require('../../drizzle/schema')

const applicationsController = {
    getApplications: async (request, reply) => {
        const { db } = request.server
        const limit = request.query.limit || 10
        const offset = request.query.offset || 0
        const { applicantId, formId, status } = request.query

        let query = db.select().from(applications)

        const conditions = []
        if (applicantId) {
            conditions.push(eq(applications.applicants, parseInt(applicantId)))
        }
        if (formId) {
            conditions.push(eq(applications.formId, formId))
        }
        if (status) {
            conditions.push(eq(applications.status, status))
        }

        if (conditions.length > 0) {
            query = query.where(and(...conditions))
        }

        const results = await query.limit(limit).offset(offset)

        return results
    },

    getApplicationById: async (request, reply) => {
        const { db } = request.server
        const { id } = request.params

        const result = await db
            .select()
            .from(applications)
            .where(eq(applications.id, parseInt(id)))
            .limit(1)

        if (result.length === 0) {
            return reply.code(404).send({
                error: 'Not found',
                message: 'Application not found'
            })
        }

        return result[0]
    },

    getApplicationsByApplicant: async (request, reply) => {
        const { db } = request.server
        const { applicantId } = request.params
        const { status } = request.query

        const conditions = [eq(applications.applicants, parseInt(applicantId))]
        if (status) {
            conditions.push(eq(applications.status, status))
        }

        const results = await db
            .select()
            .from(applications)
            .where(and(...conditions))

        return results
    },

    createApplication: async (request, reply) => {
        const { db } = request.server
        const applicationData = request.body

        try {
            const result = await db
                .insert(applications)
                .values({
                    formId: applicationData.formId,
                    applicants: applicationData.applicants,
                    status: applicationData.status
                })
                .returning()

            return reply.code(201).send(result[0])
        } catch (error) {
            // Handle foreign key constraint violations
            if (error.code === '23503') {
                if (error.message && error.message.includes('applications_applicants_fkey')) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'Applicant not found',
                        field: 'applicants'
                    })
                }
                if (error.message && error.message.includes('applications_form_id_fkey')) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'Form criterion not found',
                        field: 'formId'
                    })
                }
                return reply.code(400).send({
                    error: 'Validation failed',
                    message: 'Foreign key constraint violation'
                })
            }
            throw error
        }
    },

    updateApplication: async (request, reply) => {
        const { db } = request.server
        const { id } = request.params
        const updateData = request.body

        const updateValues = {}
        if (updateData.formId !== undefined) updateValues.formId = updateData.formId
        if (updateData.applicants !== undefined) updateValues.applicants = updateData.applicants
        if (updateData.status !== undefined) updateValues.status = updateData.status

        try {
            const result = await db
                .update(applications)
                .set(updateValues)
                .where(eq(applications.id, parseInt(id)))
                .returning()

            if (result.length === 0) {
                return reply.code(404).send({
                    error: 'Not found',
                    message: 'Application not found'
                })
            }

            return result[0]
        } catch (error) {
            // Handle foreign key constraint violations
            if (error.code === '23503') {
                if (error.message && error.message.includes('applications_applicants_fkey')) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'Applicant not found',
                        field: 'applicants'
                    })
                }
                if (error.message && error.message.includes('applications_form_id_fkey')) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'Form criterion not found',
                        field: 'formId'
                    })
                }
                return reply.code(400).send({
                    error: 'Validation failed',
                    message: 'Foreign key constraint violation'
                })
            }
            throw error
        }
    },

    submitApplication: async (request, reply) => {
        const { db } = request.server
        const { formId, applicantId, applicantData, formData, status } = request.body

        let finalApplicantId = applicantId
        let applicant = null

        try {
            // Step 1: Create or get applicant
            if (applicantId) {
                // Use existing applicant
                const applicantResult = await db
                    .select()
                    .from(applicants)
                    .where(eq(applicants.id, applicantId))
                    .limit(1)

                if (applicantResult.length === 0) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'Applicant not found',
                        field: 'applicantId'
                    })
                }
                applicant = applicantResult[0]

                // Update applicant if applicantData is provided
                if (applicantData) {
                    const updateValues = {}
                    Object.keys(applicantData).forEach(key => {
                        if (applicantData[key] !== undefined) {
                            updateValues[key] = applicantData[key]
                        }
                    })

                    if (Object.keys(updateValues).length > 0) {
                        const updated = await db
                            .update(applicants)
                            .set(updateValues)
                            .where(eq(applicants.id, applicantId))
                            .returning()
                        applicant = updated[0]
                    }
                }
            } else if (applicantData) {
                // Create new applicant
                if (!applicantData.consentTimestamp) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'consentTimestamp is required when creating a new applicant',
                        field: 'consentTimestamp'
                    })
                }

                try {
                    const created = await db
                        .insert(applicants)
                        .values(applicantData)
                        .returning()
                    applicant = created[0]
                    finalApplicantId = applicant.id
                } catch (error) {
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
                    }
                    throw error
                }
            } else {
                return reply.code(400).send({
                    error: 'Validation failed',
                    message: 'Either applicantId or applicantData must be provided',
                    field: 'applicantId, applicantData'
                })
            }

            // Step 2: Get form policy to extract required fields
            const formResult = await db
                .select()
                .from(formCriteria)
                .where(eq(formCriteria.formName, formId))
                .limit(1)

            if (formResult.length === 0) {
                return reply.code(400).send({
                    error: 'Validation failed',
                    message: 'Form criterion not found',
                    field: 'formId'
                })
            }

            const formCriterion = formResult[0]
            const policy = formCriterion.policy

            // Extract field_ids from required_fields in the policy
            const requiredFieldIds = []
            if (policy && policy.required_fields && Array.isArray(policy.required_fields)) {
                policy.required_fields.forEach(field => {
                    if (field && field.field_id) {
                        requiredFieldIds.push(field.field_id)
                    }
                })
            }

            // Step 3: Get existing applicant facts for required fields (if applicant exists)
            const existingFacts = {}
            if (finalApplicantId && requiredFieldIds.length > 0) {
                const existingFactsResult = await db
                    .select()
                    .from(applicantFacts)
                    .where(
                        and(
                            eq(applicantFacts.applicantId, finalApplicantId),
                            inArray(applicantFacts.fieldId, requiredFieldIds),
                            eq(applicantFacts.isCurrent, true)
                        )
                    )

                existingFactsResult.forEach(fact => {
                    existingFacts[fact.fieldId] = fact
                })
            }

            // Step 4: Create applicant facts from formData
            // Use formData if provided, otherwise use existing facts
            const factsCreated = []
            const factsErrors = []
            const factsToCreate = formData || {}

            // Merge: use formData if provided, otherwise use existing facts
            const allFieldIds = new Set([...requiredFieldIds, ...Object.keys(factsToCreate)])

            for (const fieldId of allFieldIds) {
                // Skip if we have existing fact and no new data provided
                if (existingFacts[fieldId] && !factsToCreate[fieldId]) {
                    continue
                }

                const value = factsToCreate[fieldId]
                if (value === undefined || value === null) {
                    continue
                }

                try {
                    // If isCurrent is true, unset previous current facts for this applicant/field
                    await db
                        .update(applicantFacts)
                        .set({ isCurrent: false })
                        .where(
                            and(
                                eq(applicantFacts.applicantId, finalApplicantId),
                                eq(applicantFacts.fieldId, fieldId),
                                eq(applicantFacts.isCurrent, true)
                            )
                        )

                    const factValue = typeof value === 'object' ? value : { raw: value }

                    const fact = await db
                        .insert(applicantFacts)
                        .values({
                            applicantId: finalApplicantId,
                            fieldId: fieldId,
                            value: factValue,
                            status: 'provided',
                            source: 'application_submission',
                            isCurrent: true
                        })
                        .returning()

                    factsCreated.push(fact[0])
                } catch (error) {
                    factsErrors.push({
                        fieldId: fieldId,
                        error: error.message || 'Failed to create fact'
                    })
                }
            }

            // Step 5: Create application record
            const application = await db
                .insert(applications)
                .values({
                    formId: formId,
                    applicants: finalApplicantId,
                    status: status || 'submitted'
                })
                .returning()

            return reply.code(201).send({
                application: application[0],
                applicant: applicant,
                facts: factsCreated,
                existingFacts: Object.values(existingFacts), // Existing facts that were found
                requiredFields: requiredFieldIds, // Field IDs from form policy
                summary: {
                    factsCreated: factsCreated.length,
                    factsErrors: factsErrors.length,
                    existingFactsFound: Object.keys(existingFacts).length
                },
                ...(factsErrors.length > 0 && { factsErrors: factsErrors })
            })
        } catch (error) {
            // Handle foreign key constraint violations
            if (error.code === '23503') {
                if (error.message && error.message.includes('applications_form_id_fkey')) {
                    return reply.code(400).send({
                        error: 'Validation failed',
                        message: 'Form criterion not found',
                        field: 'formId'
                    })
                }
                return reply.code(400).send({
                    error: 'Validation failed',
                    message: 'Foreign key constraint violation'
                })
            }
            throw error
        }
    },

    getApplicationFormData: async (request, reply) => {
        const { db } = request.server
        const { formId, applicantId } = request.query

        if (!formId || !applicantId) {
            return reply.code(400).send({
                error: 'Validation failed',
                message: 'Both formId and applicantId query parameters are required',
                field: 'formId, applicantId'
            })
        }

        const parsedApplicantId = parseInt(applicantId)

        // Get applicant data
        const applicantResult = await db
            .select()
            .from(applicants)
            .where(eq(applicants.id, parsedApplicantId))
            .limit(1)

        if (applicantResult.length === 0) {
            return reply.code(404).send({
                error: 'Not found',
                message: 'Applicant not found'
            })
        }

        const applicant = applicantResult[0]

        // Get form policy to extract required fields
        const formResult = await db
            .select()
            .from(formCriteria)
            .where(eq(formCriteria.formName, formId))
            .limit(1)

        if (formResult.length === 0) {
            return reply.code(404).send({
                error: 'Not found',
                message: 'Form criterion not found'
            })
        }

        const formCriterion = formResult[0]
        const policy = formCriterion.policy

        // Extract field_ids from required_fields in the policy
        const requiredFieldIds = []
        if (policy && policy.required_fields && Array.isArray(policy.required_fields)) {
            policy.required_fields.forEach(field => {
                if (field && field.field_id) {
                    requiredFieldIds.push(field.field_id)
                }
            })
        }

        // Get existing applicant facts for required fields
        const existingFacts = {}
        const formData = {}

        if (requiredFieldIds.length > 0) {
            const existingFactsResult = await db
                .select()
                .from(applicantFacts)
                .where(
                    and(
                        eq(applicantFacts.applicantId, parsedApplicantId),
                        inArray(applicantFacts.fieldId, requiredFieldIds),
                        eq(applicantFacts.isCurrent, true)
                    )
                )

            existingFactsResult.forEach(fact => {
                existingFacts[fact.fieldId] = fact
                // Extract value for easy form pre-population
                // If value is an object with 'raw' key, use that, otherwise use the whole value
                if (fact.value && typeof fact.value === 'object' && 'raw' in fact.value) {
                    formData[fact.fieldId] = fact.value.raw
                } else {
                    formData[fact.fieldId] = fact.value
                }
            })
        }

        // Combine applicant data with form data
        // This represents what the form submission would look like
        return {
            formId: formId,
            applicantId: parsedApplicantId,
            applicant: applicant,
            requiredFields: requiredFieldIds,
            existingFacts: existingFacts,
            formData: formData,
            // Combined view: applicant data + facts = complete form submission data
            submissionData: {
                ...formData,
                // Include applicant personal data that might be referenced by field_ids
                applicant: applicant
            }
        }
    }
}

module.exports = applicationsController
