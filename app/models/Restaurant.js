const mongoose = require('mongoose')
const reviewSchema = require('./Review')

const restaurantSchema = new mongoose.Schema(
	{
		image: {
			type: String,
			required: [true, 'Restaurant image is required '],
		},

		name: {
			type: String,
			required: [true, 'Name address is required'],
		},
		location: {
			address: {
				type: String,
				required: [true, 'Restaurant address is missing'],
			},
			city: {
				type: String,
				required: [true, 'Restaurant city is missing'],
			},
			zip_code: {
				type: String,
				required: [true, 'Restaurant zipcode is missing'],
			},
		},
		owner: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'User',
			required: true,
		},

		rating: Number,

		reviews: [reviewSchema],

		business_id: {
			type: String,
			unique: true,
		},
	},
	{
		timestamps: true,
	}
)

module.exports = mongoose.model('Restaurant', restaurantSchema)
