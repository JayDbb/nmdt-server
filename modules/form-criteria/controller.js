'use strict'

const { eq, inArray } = require('drizzle-orm')
const { formCriteria, fieldRegistry } = require('../../drizzle/schema')

const formCriteriaController = {
    getFormCriteria: async (request, reply) => {
        const { db } = request.server
        const limit = request.query.limit || 10
        const offset = request.query.offset || 0
        const isActive = request.query.isActive

        let query = db.select().from(formCriteria)

        if (isActive !== undefined) {
            query = query.where(eq(formCriteria.isActive, isActive))
        }

        const results = await query.limit(limit).offset(offset)

        return results
    },

    getFormCriterionByName: async (request, reply) => {
        const { db } = request.server
        const { formName } = request.params

        const result = await db
            .select()
            .from(formCriteria)
            .where(eq(formCriteria.formName, formName))
            .limit(1)

        if (result.length === 0) {
            return reply.code(404).send({
                error: 'Not found',
                message: 'Form criterion not found'
            })
        }

        return result[0]
    },

    createFormCriterion: async (request, reply) => {
        const { db } = request.server
        const formData = request.body

        try {
            const result = await db
                .insert(formCriteria)
                .values({
                    formName: formData.formName,
                    version: formData.version || 1,
                    policy: formData.policy,
                    isActive: formData.isActive !== undefined ? formData.isActive : true
                })
                .returning()

            return reply.code(201).send(result[0])
        } catch (error) {
            if (error.code === '23505') {
                return reply.code(400).send({
                    error: 'Validation failed',
                    message: 'Form criterion with this name already exists',
                    field: 'formName'
                })
            }
            throw error
        }
    },

    updateFormCriterion: async (request, reply) => {
        const { db } = request.server
        const { formName } = request.params
        const updateData = request.body

        const updateValues = {}
        if (updateData.version !== undefined) updateValues.version = updateData.version
        if (updateData.policy !== undefined) updateValues.policy = updateData.policy
        if (updateData.isActive !== undefined) updateValues.isActive = updateData.isActive
        updateValues.updatedAt = new Date()

        const result = await db
            .update(formCriteria)
            .set(updateValues)
            .where(eq(formCriteria.formName, formName))
            .returning()

        if (result.length === 0) {
            return reply.code(404).send({
                error: 'Not found',
                message: 'Form criterion not found'
            })
        }

        return result[0]
    },

    getFormPolicyWithDictionary: async (request, reply) => {
        const { db } = request.server
        // Get formName from query parameter (easier to handle spaces and special characters)
        const { formName } = request.query

        if (!formName) {
            return reply.code(400).send({
                error: 'Validation failed',
                message: 'formName query parameter is required',
                field: 'formName'
            })
        }

        // Get the form criterion
        const formResult = await db
            .select()
            .from(formCriteria)
            .where(eq(formCriteria.formName, formName))
            .limit(1)

        if (formResult.length === 0) {
            return reply.code(404).send({
                error: 'Not found',
                message: 'Form criterion not found'
            })
        }

        const formCriterion = formResult[0]

        // Access policy - Drizzle returns JSONB as an object
        // Handle case where policy might be a string (shouldn't happen but just in case)
        let policy = formCriterion.policy

        // console.log(formCriterion.policy.required_fields)



        // If policy is still null or undefined, return error
        if (policy === null || policy === undefined) {
            return reply.code(404).send({
                error: 'Not found',
                message: 'Policy not found for this form criterion. The policy field may be null in the database.'
            })
        }

        // Return policy even if it's an empty object (let the client handle it)

        // Extract field_ids from required_fields in the policy
        const fieldIds = []
        if (policy && policy.required_fields && Array.isArray(policy.required_fields)) {
            policy.required_fields.forEach(field => {
                if (field && field.field_id) {
                    fieldIds.push(field.field_id)
                }
            })
        }

        // Look up field registry entries for the extracted field_ids
        // console.log(fieldIds)
        // console.log(policy.required_fields)
        const dictionary = {}
        if (fieldIds.length > 0) {
            const fieldEntries = await db
                .select()
                .from(fieldRegistry)
                .where(inArray(fieldRegistry.fieldId, fieldIds))

            // Create a dictionary mapping field_id to field registry entry
            fieldEntries.forEach(field => {
                dictionary[field.fieldId] = {
                    fieldId: field.fieldId,
                    title: field.title,
                    promptTemplate: field.promptTemplate,
                    type: field.type,
                    validation: field.validation || {},
                    normalizers: field.normalizers || {},
                    aliases: field.aliases || [],
                    createdAt: field.createdAt,
                    updatedAt: field.updatedAt
                }
            })
        }

        console.log(policy)

        return {
            policy: policy.required_fields,
            dictionary: dictionary
        }
    }
}

module.exports = formCriteriaController
