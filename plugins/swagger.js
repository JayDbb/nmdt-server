'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  // Register Swagger
  await fastify.register(require('@fastify/swagger'), {
    swagger: {
      info: {
        title: 'NMDT Server API',
        description: 'API documentation for NMDT Server',
        version: '1.0.0'
      },
      externalDocs: {
        url: 'https://swagger.io',
        description: 'Find more info here'
      },
      host: 'localhost:3000',
      schemes: ['http'],
      consumes: ['application/json'],
      produces: ['application/json'],
      tags: [
        { name: 'root', description: 'Root endpoint' },
        { name: 'example', description: 'Example endpoints' },
        { name: 'applicants', description: 'Applicant management endpoints' },
        { name: 'form-criteria', description: 'Form criteria management endpoints' },
        { name: 'field-registry', description: 'Field registry management endpoints' },
        { name: 'applicant-facts', description: 'Applicant facts management endpoints' }
      ]
    }
  })

  // Register Swagger UI
  await fastify.register(require('@fastify/swagger-ui'), {
    routePrefix: '/documentation',
    uiConfig: {
      docExpansion: 'full',
      deepLinking: false
    },
    uiHooks: {
      onRequest: function (request, reply, next) { next() },
      preHandler: function (request, reply, next) { next() }
    },
    staticCSP: true,
    transformStaticCSP: (header) => header,
    transformSpecification: (swaggerObject, request, reply) => { return swaggerObject },
    transformSpecificationClone: true
  })
})
