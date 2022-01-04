const mongoose = require('mongoose')

const reviewSchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    content: String
  },
  {
    timestamps: true
  }
)

module.exports = reviewSchema
