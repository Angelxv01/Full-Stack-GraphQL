const mongoose = require('mongoose')
const unique = require('mongoose-unique-validator')
const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minLength: 2
  },
  published: {
    type: Number
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Author'
  },
  genres: [{ type: String }]
})

schema.plugin(unique)

module.exports = mongoose.model('Book', schema)
