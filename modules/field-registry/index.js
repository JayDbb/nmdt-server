'use strict'

const fp = require('fastify-plugin')
const fieldRegistrySchemas = require('./schema')
const fieldRegistryController = require('./controller')

module.exports = fp(async function (fastify, opts) {
  // Register routes with /field-registry prefix
  fastify.register(async function (fastify) {
    fastify.get('/', {
      schema: fieldRegistrySchemas.getFieldRegistry
    }, fieldRegistryController.getFieldRegistry)

    fastify.get('/:fieldId', {
      schema: fieldRegistrySchemas.getFieldById
    }, fieldRegistryController.getFieldById)

    fastify.post('/', {
      schema: fieldRegistrySchemas.createField
    }, fieldRegistryController.createField)

    fastify.put('/:fieldId', {
      schema: fieldRegistrySchemas.updateField
    }, fieldRegistryController.updateField)
  }, { prefix: '/field-registry' })
})
