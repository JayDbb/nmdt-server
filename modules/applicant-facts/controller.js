'use strict'

const { eq, and, ne } = require('drizzle-orm')
const { applicantFacts } = require('../../drizzle/schema')

const applicantFactsController = {
  getApplicantFacts: async (request, reply) => {
    const { db } = request.server
    const limit = request.query.limit || 10
    const offset = request.query.offset || 0
    const { applicantId, fieldId, isCurrent, status } = request.query

    let query = db.select().from(applicantFacts)

    const conditions = []
    if (applicantId) {
      conditions.push(eq(applicantFacts.applicantId, parseInt(applicantId)))
    }
    if (fieldId) {
      conditions.push(eq(applicantFacts.fieldId, fieldId))
    }
    if (isCurrent !== undefined) {
      conditions.push(eq(applicantFacts.isCurrent, isCurrent))
    }
    if (status) {
      conditions.push(eq(applicantFacts.status, status))
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions))
    }

    const results = await query.limit(limit).offset(offset)

    return results
  },

  getApplicantFactsByApplicant: async (request, reply) => {
    const { db } = request.server
    const { applicantId } = request.params
    const { isCurrent, status } = request.query

    let query = db
      .select()
      .from(applicantFacts)
      .where(eq(applicantFacts.applicantId, parseInt(applicantId)))

    const conditions = [eq(applicantFacts.applicantId, parseInt(applicantId))]
    if (isCurrent !== undefined) {
      conditions.push(eq(applicantFacts.isCurrent, isCurrent))
    }
    if (status) {
      conditions.push(eq(applicantFacts.status, status))
    }

    if (conditions.length > 1) {
      query = query.where(and(...conditions))
    }

    const results = await query

    return results
  },

  getApplicantFactById: async (request, reply) => {
    const { db } = request.server
    const { id } = request.params

    const result = await db
      .select()
      .from(applicantFacts)
      .where(eq(applicantFacts.id, parseInt(id)))
      .limit(1)

    if (result.length === 0) {
      return reply.code(404).send({
        error: 'Not found',
        message: 'Applicant fact not found'
      })
    }

    return result[0]
  },

  createApplicantFact: async (request, reply) => {
    const { db } = request.server
    const factData = request.body

    try {
      // If isCurrent is true, we need to set previous facts with same applicantId and fieldId to false
      if (factData.isCurrent !== false) {
        await db
          .update(applicantFacts)
          .set({ isCurrent: false })
          .where(
            and(
              eq(applicantFacts.applicantId, factData.applicantId),
              eq(applicantFacts.fieldId, factData.fieldId),
              eq(applicantFacts.isCurrent, true)
            )
          )
      }

      const result = await db
        .insert(applicantFacts)
        .values({
          applicantId: factData.applicantId,
          fieldId: factData.fieldId,
          value: factData.value,
          status: factData.status || 'provided',
          source: factData.source,
          isCurrent: factData.isCurrent !== undefined ? factData.isCurrent : true
        })
        .returning()

      return reply.code(201).send(result[0])
    } catch (error) {
      // Handle foreign key constraint violation
      if (error.code === '23503') {
        return reply.code(400).send({
          error: 'Validation failed',
          message: 'Applicant not found',
          field: 'applicantId'
        })
      }
      // Handle unique constraint violation (current fact)
      if (error.code === '23505') {
        return reply.code(400).send({
          error: 'Validation failed',
          message: 'A current fact already exists for this applicant and field',
          field: 'applicantId, fieldId'
        })
      }
      throw error
    }
  },

  updateApplicantFact: async (request, reply) => {
    const { db } = request.server
    const { id } = request.params
    const updateData = request.body

    const updateValues = {}
    if (updateData.value !== undefined) updateValues.value = updateData.value
    if (updateData.status !== undefined) updateValues.status = updateData.status
    if (updateData.source !== undefined) updateValues.source = updateData.source
    if (updateData.isCurrent !== undefined) {
      updateValues.isCurrent = updateData.isCurrent
      // If setting to current, unset other current facts for the same applicant/field
      if (updateData.isCurrent === true) {
        const existingFact = await db
          .select()
          .from(applicantFacts)
          .where(eq(applicantFacts.id, parseInt(id)))
          .limit(1)

        if (existingFact.length > 0) {
          // Unset other current facts (excluding the one we're updating)
          await db
            .update(applicantFacts)
            .set({ isCurrent: false })
            .where(
              and(
                eq(applicantFacts.applicantId, existingFact[0].applicantId),
                eq(applicantFacts.fieldId, existingFact[0].fieldId),
                eq(applicantFacts.isCurrent, true),
                ne(applicantFacts.id, parseInt(id))
              )
            )
        }
      }
    }
    updateValues.updatedAt = new Date()

    const result = await db
      .update(applicantFacts)
      .set(updateValues)
      .where(eq(applicantFacts.id, parseInt(id)))
      .returning()

    if (result.length === 0) {
      return reply.code(404).send({
        error: 'Not found',
        message: 'Applicant fact not found'
      })
    }

    return result[0]
  }
}

module.exports = applicantFactsController
