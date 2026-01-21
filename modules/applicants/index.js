'use strict'

const fp = require('fastify-plugin')
const applicantsSchemas = require('./schema')
const applicantsController = require('./controller')

module.exports = fp(async function (fastify, opts) {
  // Register routes with /applicants prefix
  fastify.register(async function (fastify) {
    fastify.get('/', {
      schema: applicantsSchemas.getApplicants
    }, applicantsController.getApplicants)

    fastify.get('/:id', {
      schema: applicantsSchemas.getApplicantById
    }, applicantsController.getApplicantById)

    fastify.post('/', {
      schema: applicantsSchemas.createApplicant
    }, applicantsController.createApplicant)

    fastify.put('/:id', {
      schema: applicantsSchemas.updateApplicant
    }, applicantsController.updateApplicant)
  }, { prefix: '/applicants' })
})
