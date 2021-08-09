const { ApolloServer, gql, UserInputError } = require('apollo-server')
const jwt = require('jsonwebtoken')
require('dotenv').config()

const mongoose = require('mongoose')

const Author = require('./models/author')
const Book = require('./models/book')
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

const typeDefs = gql`
  type Author {
    name: String!
    id: String!
    born: Int
    bookCount: Int!
  }

  type Book {
    title: String!
    published: Int!
    author: Author!
    id: ID!
    genres: [String!]!
  }

  type User {
    username: String!
    favoriteGenre: String!
    id: ID!
  }

  type Token {
    value: String!
  }

  type Query {
    booksCount: Int!
    authorsCount: Int!
    allBooks(author: String, genres: String): [Book!]!
    allAuthors: [Author!]!
    me: User
  }

  type Mutation {
    addBook(
      title: String!
      published: Int!
      author: String!
      genres: [String!]!
    ): Book
    editAuthor(name: String!, setBornTo: Int!): Author
    createUser(username: String!, favoriteGenre: String!): User
    login(username: String!, password: String!): Token
  }
`

const resolvers = {
  Query: {
    authorsCount: async () =>
      await Author.countDocuments({}, (err, res) => res),
    booksCount: async () => await Book.countDocuments({}, (err, res) => res),
    allBooks: async (root, args) => {
      let data
      if (args.genres) {
        data = await Book.find({ genres: { $in: [args.genres] } }).populate(
          'author'
        )
      } else {
        data = await Book.find({}).populate('author')
      }
      return data
    },
    allAuthors: async () => await Author.find({})
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      const res = await Book.countDocuments({ author: author._id })
      return res
    }
  },
  Mutation: {
    addBook: async (root, args) => {
      const authorData = { name: args.author }
      let author = await Author.findOne(authorData)
      if (!author) {
        author = new Author(authorData)
        try {
          await author.save()
        } catch (err) {
          throw new UserInputError(err.message, { invalidArgs: args })
        }
      }

      const book = new Book({ ...args, author: author._id })
      try {
        await book.save()
      } catch (err) {
        throw new UserInputError(err.message, { invalidArgs: args })
      }

      await book.populate('author').execPopulate()
      return book
    },
    editAuthor: async (root, args) => {
      const author = await Author.findOneAndUpdate(
        { name: args.name },
        { $set: { born: args.setBornTo } },
        { new: true }
      )
      return author
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})
