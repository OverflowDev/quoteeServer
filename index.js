const express = require('express')

const {ApolloServer} = require('@apollo/server')
const {expressMiddleware } = require('@apollo/server/express4')
const {ApolloServerPluginDrainHttpServer  } = require('@apollo/server/plugin/drainHttpServer')

const cors = require('cors')
const http = require('http')

const {json} = require('body-parser')

const dotenv = require('dotenv').config()

const connectDB = require('./db/db')

const typeDefs = require('./graphql/typeDefs')
const resolvers = require('./graphql/resolvers')

const PORT = process.env.PORT || 7000

async function startServer() {
    const app = express()

    const httpServer = http.createServer(app)

    const apolloServer = new ApolloServer({
        typeDefs,
        resolvers,
        plugins: [ApolloServerPluginDrainHttpServer({httpServer})]
    })

    await apolloServer.start()

    app.use(
        '/quotee',
        cors(),
        json(),
        expressMiddleware(apolloServer, {
            context: async ({req}) => ({req})
        })
    )

    // Connect to Db 
    connectDB()

    // Start Server 
    await new Promise((resolve) => app.listen(PORT, resolve))
    console.log(`🚀 Server ready`)
}

startServer()