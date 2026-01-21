'use strict'

const fastify = require('fastify')
const app = require('../app')

// Create and configure Fastify instance
const server = fastify({
    logger: process.env.NODE_ENV !== 'production'
})

// Register the app plugin
server.register(app)

// Initialize server (call once)
let isReady = false
const initServer = async () => {
    if (!isReady) {
        await server.ready()
        isReady = true
    }
}

// Export the serverless handler for Vercel
module.exports = async (req, res) => {
    await initServer()
    // Pass request to Fastify's HTTP server
    server.server.emit('request', req, res)
}
