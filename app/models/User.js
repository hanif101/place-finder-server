const mongoose = require('mongoose')

const userSchema = new mongoose.Schema(
	{
		username: {
			type: String,
			unique: [true, 'This username has been already taken.'],
			required: [true, 'Username is required'],
			trim: true,
		},

		email: {
			type: String,
			required: [true, 'Email address is required'],
			unique: [true, 'This email address has been already taken.'],
			lowercase: true,
			trim: true,
			match: [
				/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
				'Please provide a valid email address...',
			],
		},

		hashedPassword: {
			type: String,
			trim: true,
			minlength: [5, 'Password must be at least 6 char long.'],
			required: [true, 'Please provide a password..'],
		},

		profile_img: {
			type: String,
			default: 'default.jpg',
		},

		token: String,
	},
	{
		timestamps: true,
		toObject: {
			// remove `hashedPassword` field when we call `.toObject`
			transform: (_doc, user) => {
				delete user.hashedPassword
				return user
			},
		},
	}
)

module.exports = mongoose.model('User', userSchema)
