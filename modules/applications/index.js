'use strict'

const fp = require('fastify-plugin')
const applicationsSchemas = require('./schema')
const applicationsController = require('./controller')

module.exports = fp(async function (fastify, opts) {
    // Register routes with /applications prefix
    fastify.register(async function (fastify) {
        fastify.get('/', {
            schema: applicationsSchemas.getApplications
        }, applicationsController.getApplications)

        fastify.get('/applicant/:applicantId', {
            schema: applicationsSchemas.getApplicationsByApplicant
        }, applicationsController.getApplicationsByApplicant)

        // Get form data endpoint must come before /:id route
        fastify.get('/form-data', {
            schema: applicationsSchemas.getApplicationFormData
        }, applicationsController.getApplicationFormData)

        // Submit endpoint must come before /:id route
        fastify.post('/submit', {
            schema: applicationsSchemas.submitApplication
        }, applicationsController.submitApplication)

        fastify.get('/:id', {
            schema: applicationsSchemas.getApplicationById
        }, applicationsController.getApplicationById)

        fastify.post('/', {
            schema: applicationsSchemas.createApplication
        }, applicationsController.createApplication)

        fastify.put('/:id', {
            schema: applicationsSchemas.updateApplication
        }, applicationsController.updateApplication)
    }, { prefix: '/applications' })
})
