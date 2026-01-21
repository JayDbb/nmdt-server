'use strict'

const fp = require('fastify-plugin')
const dotenv = require('dotenv')

// Load environment variables from .env (if present).
// This runs once at startup and makes DATABASE_URL available to other plugins.
module.exports = fp(async function (fastify, opts) {
  dotenv.config()
})

