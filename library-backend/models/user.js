const mongoose = require('mongoose')
const unique = require('mongoose-unique-validator')

const schema = mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    minLength: 4
  },
  favoriteGenre: {
    type: String
  }
})

schema.plugin(unique)

module.exports = mongoose.model('User', schema)
