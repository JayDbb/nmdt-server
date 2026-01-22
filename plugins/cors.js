'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
  await fastify.register(require('@fastify/cors'), {
    origin: true, // Allow all origins (change to specific origins in production)
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true
  })
})
