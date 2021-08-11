const { PubSub } = require('graphql-subscriptions')
const { UserInputError } = require('apollo-server-express')

const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')

const pubSub = new PubSub()

const resolvers = {
  Query: {
    authorsCount: () => Author.collection.countDocuments(),
    booksCount: () => Book.collection.countDocuments(),
    allBooks: async (root, args) => {
      const books = args.genres
        ? Book.find({ genres: { $in: [args.genres] } }).populate('author')
        : Book.find({}).populate('author')
      return books
    },
    allAuthors: () => Author.find({}),
    me: (root, args, context) => context.currentUser
  },
  Author: {
    bookCount: async (root) => {
      const author = await Author.findOne({ name: root.name })
      const res = await Book.countDocuments({ author: author._id })
      return res
    }
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
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
      pubSub.publish('BOOK_ADDED', { bookAdded: book })
      return book
    },
    editAuthor: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }
      const author = await Author.findOneAndUpdate(
        { name: args.name },
        { $set: { born: args.setBornTo } },
        { new: true }
      )
      return author
    },
    createUser: (root, args) => {
      const user = new User({ ...args })
      return user.save().catch((err) => {
        throw new UserInputError(err.message, { invalidArgs: args })
      })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
      if (!user || args.password !== 'password') {
        throw new UserInputError('Invalid credentials')
      }
      const userToken = {
        username: user.username,
        id: user._id
      }

      return { value: jwt.sign(userToken, process.env.SECRET) }
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubSub.asyncIterator(['BOOK_ADDED'])
    }
  }
}

module.exports = resolvers
