'use strict'

const fp = require('fastify-plugin')
const applicantFactsSchemas = require('./schema')
const applicantFactsController = require('./controller')

module.exports = fp(async function (fastify, opts) {
  // Register routes with /applicant-facts prefix
  fastify.register(async function (fastify) {
    fastify.get('/', {
      schema: applicantFactsSchemas.getApplicantFacts
    }, applicantFactsController.getApplicantFacts)

    fastify.get('/applicant/:applicantId', {
      schema: applicantFactsSchemas.getApplicantFactsByApplicant
    }, applicantFactsController.getApplicantFactsByApplicant)

    fastify.get('/:id', {
      schema: applicantFactsSchemas.getApplicantFactById
    }, applicantFactsController.getApplicantFactById)

    fastify.post('/', {
      schema: applicantFactsSchemas.createApplicantFact
    }, applicantFactsController.createApplicantFact)

    fastify.put('/:id', {
      schema: applicantFactsSchemas.updateApplicantFact
    }, applicantFactsController.updateApplicantFact)
  }, { prefix: '/applicant-facts' })
})
