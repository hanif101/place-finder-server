const mongoose = require('mongoose')
const reviewSchema = require('./Review')

const businessSchema = new mongoose.Schema(
  {
    id4unique: {
      type: String,
      unique: true
    },
    image: String,
    name: String,
    address: [],
    rating: Number,
    review_count: Number,
    phone: String,

    default_reviews: [],
    reviews: [reviewSchema],

    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  },
  {
    timestamps: true
  }
)

module.exports = mongoose.model('Business', businessSchema)
