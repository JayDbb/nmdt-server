'use strict'

const fp = require('fastify-plugin')
const formCriteriaSchemas = require('./schema')
const formCriteriaController = require('./controller')

module.exports = fp(async function (fastify, opts) {
    // Register routes with /form-criteria prefix
    fastify.register(async function (fastify) {
        fastify.get('/', {
            schema: formCriteriaSchemas.getFormCriteria
        }, formCriteriaController.getFormCriteria)

        // Get policy with dictionary - uses query parameter for formName
        fastify.get('/policy', {
            schema: formCriteriaSchemas.getFormPolicyWithDictionary
        }, formCriteriaController.getFormPolicyWithDictionary)

        fastify.get('/:formName', {
            schema: formCriteriaSchemas.getFormCriterionByName
        }, formCriteriaController.getFormCriterionByName)

        fastify.post('/', {
            schema: formCriteriaSchemas.createFormCriterion
        }, formCriteriaController.createFormCriterion)

        fastify.put('/:formName', {
            schema: formCriteriaSchemas.updateFormCriterion
        }, formCriteriaController.updateFormCriterion)
    }, { prefix: '/form-criteria' })
})
