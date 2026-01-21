'use strict'

const fp = require('fastify-plugin')

module.exports = fp(async function (fastify, opts) {
    fastify.setErrorHandler(function (error, request, reply) {
        // Handle validation errors - check multiple possible properties
        // Fastify validation errors have statusCode 400 and either a validation array or a message about validation
        const isValidationError = error.validation ||
            (error.statusCode === 400 && (
                error.message?.includes('must') ||
                error.message?.includes('required') ||
                error.message?.includes('property')
            ))

        if (isValidationError) {
            console.log(error)
            let validationErrors = []

            // If we have a validation array, process it
            if (error.validation && Array.isArray(error.validation)) {
                validationErrors = error.validation.map(err => {
                    // Extract field name from various possible locations
                    let field = 'unknown'
                    if (err.params?.missingProperty) {
                        field = err.params.missingProperty
                    } else if (err.instancePath) {
                        // Remove leading slash and get the field name
                        const path = err.instancePath.replace(/^\//, '')
                        field = path.split('/').pop() || path || 'unknown'
                    } else if (err.dataPath) {
                        const path = err.dataPath.replace(/^\//, '')
                        field = path.split('/').pop() || path || 'unknown'
                    }

                    // If field is still unknown, try to get it from the schema path
                    if (field === 'unknown' && err.schemaPath) {
                        const schemaParts = err.schemaPath.split('/')
                        // Look for property names in the schema path
                        for (let i = schemaParts.length - 1; i >= 0; i--) {
                            if (schemaParts[i] === 'properties' && schemaParts[i + 1]) {
                                field = schemaParts[i + 1]
                                break
                            }
                        }
                    }

                    let message = err.message || 'Invalid value'

                    // Make error messages more user-friendly
                    if (err.keyword === 'required') {
                        message = `${field} is required`
                    } else if (err.keyword === 'type') {
                        const expectedType = err.params?.type || 'unknown'
                        message = `${field} must be of type ${expectedType}`
                    } else if (err.keyword === 'format') {
                        const format = err.params?.format || 'format'
                        message = `${field} must be a valid ${format} (e.g., ${format === 'date' ? 'YYYY-MM-DD' : format})`
                    } else if (err.keyword === 'minimum' || err.keyword === 'maximum') {
                        message = `${field} must be ${err.keyword === 'minimum' ? 'at least' : 'at most'} ${err.params?.limit}`
                    } else if (err.keyword === 'enum') {
                        message = `${field} must be one of: ${err.params?.allowedValues?.join(', ') || 'allowed values'}`
                    }

                    return {
                        field: field,
                        message: message
                    }
                })
            } else {
                // Parse error message to extract field name
                // Handle messages like "body must have required property 'consentTimestamp'"
                const message = error.message || ''
                let field = 'unknown'
                let userMessage = message

                // Extract field from "body must have required property 'fieldName'"
                // Pattern: "body must have required property 'consentTimestamp'"
                const requiredMatch = message.match(/(?:body|params|query|headers) must have required property ['"]([^'"]+)['"]/i)
                if (requiredMatch) {
                    field = requiredMatch[1]
                    userMessage = `${field} is required`
                }
                // Extract field from "must match format" or similar
                else if (message.includes('format')) {
                    const formatMatch = message.match(/property ['"]([^'"]+)['"] must match format ['"]([^'"]+)['"]/i)
                    if (formatMatch) {
                        field = formatMatch[1]
                        const formatType = formatMatch[2] || 'format'
                        userMessage = `${field} must be a valid ${formatType}${formatType === 'date' ? ' (e.g., YYYY-MM-DD)' : ''}`
                    } else {
                        // Try alternative pattern
                        const altMatch = message.match(/property ['"]([^'"]+)['"]/i)
                        if (altMatch) {
                            field = altMatch[1]
                            userMessage = `${field} must match the required format`
                        }
                    }
                }
                // Extract field from "must be" type errors
                else if (message.includes('must be')) {
                    const typeMatch = message.match(/property ['"]([^'"]+)['"] must be (?:of type )?['"]?([^'"]+)['"]?/i)
                    if (typeMatch) {
                        field = typeMatch[1]
                        const expectedType = typeMatch[2] || 'the correct type'
                        userMessage = `${field} must be ${expectedType}`
                    } else {
                        // Try simpler pattern
                        const simpleMatch = message.match(/property ['"]([^'"]+)['"]/i)
                        if (simpleMatch) {
                            field = simpleMatch[1]
                            userMessage = message
                        }
                    }
                }

                validationErrors = [{
                    field: field,
                    message: userMessage
                }]
            }

            return reply.code(400).send({
                error: 'Validation failed',
                message: 'One or more fields failed validation',
                details: validationErrors
            })
        }

        // Handle other errors
        const statusCode = error.statusCode || 500
        const message = error.message || 'Internal server error'

        // Don't expose internal errors in production
        if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
            return reply.code(statusCode).send({
                error: 'Internal server error',
                message: 'An unexpected error occurred'
            })
        }

        return reply.code(statusCode).send({
            error: error.name || 'Error',
            message: message
        })
    })
})
