const mongoose = require('mongoose')
const unique = require('mongoose-unique-validator')

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    minLength: 4
  },
  born: {
    type: Number
  }
})

schema.plugin(unique)

module.exports = mongoose.model('Author', schema)
