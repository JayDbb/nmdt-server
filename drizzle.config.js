'use strict'

/**
 * drizzle-kit config
 * Docs: https://orm.drizzle.team/kit-docs/overview
 */
module.exports = {
  dialect: 'postgresql',
  schema: './drizzle/schema.js',
  out: './drizzle/migrations',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL
  }
}

