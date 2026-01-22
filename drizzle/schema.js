'use strict'

const { pgTable, bigint, timestamp, text, numeric, date, boolean, integer, jsonb, index, uniqueIndex } = require('drizzle-orm/pg-core')
const { relations } = require('drizzle-orm')

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

// Matches:
// create table public.form_criteria (...)
const formCriteria = pgTable('form_criteria', {
  formName: text('form_name').primaryKey(),
  version: integer('version').notNull().default(1),
  policy: jsonb('policy').notNull(),
  isActive: boolean('is_active').notNull().default(true),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  activeIdx: index('form_criteria_active_idx').on(table.isActive),
  policyGinIdx: index('form_criteria_policy_gin_idx').using('gin', table.policy)
}))

// Matches:
// create table public.field_registry (...)
const fieldRegistry = pgTable('field_registry', {
  fieldId: text('field_id').primaryKey(),
  title: text('title').notNull(),
  promptTemplate: text('prompt_template').notNull(),
  type: text('type').notNull(),
  validation: jsonb('validation').default('{}'),
  normalizers: jsonb('normalizers').default('{}'),
  aliases: jsonb('aliases').default('[]'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow()
}, (table) => ({
  typeIdx: index('field_registry_type_idx').on(table.type),
  aliasesGinIdx: index('field_registry_aliases_gin_idx').using('gin', table.aliases)
}))

// Matches:
// create table public.applicant_facts (...)
const applicantFacts = pgTable('applicant_facts', {
  id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
  applicantId: bigint('applicant_id', { mode: 'number' }).notNull().references(() => applicants.id, { onDelete: 'cascade' }),
  fieldId: text('field_id').notNull(),
  value: jsonb('value').notNull(),
  status: text('status').notNull().default('provided'),
  source: text('source'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  isCurrent: boolean('is_current').notNull().default(true)
}, (table) => ({
  lookupIdx: index('applicant_facts_lookup').on(table.applicantId, table.fieldId),
  uniqueCurrentIdx: uniqueIndex('applicant_facts_unique_current').on(table.applicantId, table.fieldId).where(table.isCurrent.eq(true))
}))

// Matches:
// create table public.applications (...)
const applications = pgTable('applications', {
  id: bigint('id', { mode: 'number' }).generatedByDefaultAsIdentity().primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  formId: text('form_id').references(() => formCriteria.formName),
  applicants: bigint('applicants', { mode: 'number' }).references(() => applicants.id),
  status: text('status')
})

// Define relations
const applicantsRelations = relations(applicants, ({ many }) => ({
  facts: many(applicantFacts),
  applications: many(applications)
}))

const applicantFactsRelations = relations(applicantFacts, ({ one }) => ({
  applicant: one(applicants, {
    fields: [applicantFacts.applicantId],
    references: [applicants.id]
  })
}))

const applicationsRelations = relations(applications, ({ one }) => ({
  applicant: one(applicants, {
    fields: [applications.applicants],
    references: [applicants.id]
  }),
  formCriterion: one(formCriteria, {
    fields: [applications.formId],
    references: [formCriteria.formName]
  })
}))

const formCriteriaRelations = relations(formCriteria, ({ many }) => ({
  applications: many(applications)
}))

module.exports = {
  applicants,
  formCriteria,
  fieldRegistry,
  applicantFacts,
  applications
}

