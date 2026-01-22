'use strict'

const { eq } = require('drizzle-orm')
const { fieldRegistry } = require('../../drizzle/schema')

const fieldRegistryController = {
  getFieldRegistry: async (request, reply) => {
    const { db } = request.server
    const limit = request.query.limit || 10
    const offset = request.query.offset || 0
    const type = request.query.type

    let query = db.select().from(fieldRegistry)

    if (type) {
      query = query.where(eq(fieldRegistry.type, type))
    }

    const results = await query.limit(limit).offset(offset)

    return results
  },

  getFieldById: async (request, reply) => {
    const { db } = request.server
    const { fieldId } = request.params

    const result = await db
      .select()
      .from(fieldRegistry)
      .where(eq(fieldRegistry.fieldId, fieldId))
      .limit(1)

    if (result.length === 0) {
      return reply.code(404).send({
        error: 'Not found',
        message: 'Field registry entry not found'
      })
    }

    return result[0]
  },

  createField: async (request, reply) => {
    const { db } = request.server
    const fieldData = request.body

    try {
      const result = await db
        .insert(fieldRegistry)
        .values({
          fieldId: fieldData.fieldId,
          title: fieldData.title,
          promptTemplate: fieldData.promptTemplate,
          type: fieldData.type,
          validation: fieldData.validation || {},
          normalizers: fieldData.normalizers || {},
          aliases: fieldData.aliases || []
        })
        .returning()

      return reply.code(201).send(result[0])
    } catch (error) {
      if (error.code === '23505') {
        return reply.code(400).send({
          error: 'Validation failed',
          message: 'Field registry entry with this ID already exists',
          field: 'fieldId'
        })
      }
      throw error
    }
  },

  updateField: async (request, reply) => {
    const { db } = request.server
    const { fieldId } = request.params
    const updateData = request.body

    const updateValues = {}
    if (updateData.title !== undefined) updateValues.title = updateData.title
    if (updateData.promptTemplate !== undefined) updateValues.promptTemplate = updateData.promptTemplate
    if (updateData.type !== undefined) updateValues.type = updateData.type
    if (updateData.validation !== undefined) updateValues.validation = updateData.validation
    if (updateData.normalizers !== undefined) updateValues.normalizers = updateData.normalizers
    if (updateData.aliases !== undefined) updateValues.aliases = updateData.aliases
    updateValues.updatedAt = new Date()

    const result = await db
      .update(fieldRegistry)
      .set(updateValues)
      .where(eq(fieldRegistry.fieldId, fieldId))
      .returning()

    if (result.length === 0) {
      return reply.code(404).send({
        error: 'Not found',
        message: 'Field registry entry not found'
      })
    }

    return result[0]
  }
}

module.exports = fieldRegistryController
