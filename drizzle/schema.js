'use strict'

const { pgTable, bigint, timestamp, text, numeric, date } = require('drizzle-orm/pg-core')

// Matches:
// create table public.applicants (...)
const applicants = pgTable('applicants', {
  id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  nis: text('nis'),
  phone: numeric('phone'),
  fullName: text('full_name'),
  trn: numeric('trn'),
  address: text('address'),
  constituency: text('constituency'),
  division: text('division'),
  votersIdPath: text('voters_id_path'),
  dob: date('dob'),
  gender: text('gender'),
  consentTimestamp: date('consent_timestamp').notNull()
})

module.exports = {
  applicants
}

