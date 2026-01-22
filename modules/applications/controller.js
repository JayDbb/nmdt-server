'use strict'

const { eq, and } = require('drizzle-orm')
const { applications } = require('../../drizzle/schema')

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
  }
}

module.exports = applicationsController
