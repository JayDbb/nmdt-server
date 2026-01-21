'use strict'

const fp = require('fastify-plugin')
const { Pool } = require('pg')
const { drizzle } = require('drizzle-orm/node-postgres')

module.exports = fp(async function (fastify, opts) {
  const connectionString = process.env.DATABASE_URL
  if (!connectionString) {
    throw new Error('Missing DATABASE_URL env var (Supabase Postgres connection string)')
  }

  const pool = new Pool({
    connectionString,
    // Supabase requires TLS; most connection strings include sslmode=require,
    // but Node's pg still needs ssl enabled when connecting to many hosted providers.
    ssl: { rejectUnauthorized: false }
  })

  const db = drizzle(pool)

  fastify.decorate('pgPool', pool)
  fastify.decorate('db', db)

  fastify.addHook('onClose', async () => {
    await pool.end()
  })
})

