const { ApolloServer, gql, UserInputError } = require('apollo-server-express')
const express = require('express')
const cors = require('cors')
const { createServer } = require('http')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const { makeExecutableSchema } = require('@graphql-tools/schema')

const jwt = require('jsonwebtoken')
require('dotenv').config()

const mongoose = require('mongoose')

const User = require('./models/user')

const typeDefs = require('./typeDefs')
const resolvers = require('./resolvers')

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true
  })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const schema = makeExecutableSchema({ typeDefs, resolvers })

const server = new ApolloServer({
  schema,
  context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decoded = jwt.verify(auth.substr(7), process.env.SECRET)
      const currentUser = await User.findById(decoded.id)
      return { currentUser }
    }
  }
})

server.start().then(() => {
  const app = express()
  app.use(cors())
  server.applyMiddleware({ app })

  const httpServer = createServer(app)

  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe
    },
    { server: httpServer, path: server.graphqlPath }
  )

  const signals = ['SIGINT', 'SIGTERM']

  signals.forEach((signal) => {
    process.on(signal, () => subscriptionServer.close())
  })

  httpServer.listen(4000, () => console.log('Listening on port 4000'))
})
