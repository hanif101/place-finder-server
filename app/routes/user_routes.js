// require NPM packages
const express = require('express')
const crypto = require('crypto')
const passport = require('passport')
const bcrypt = require('bcrypt')
const asyncErrorWrapper = require('express-async-handler')

// see above for explanation of "salting", 10 rounds is recommended
const bcryptSaltRounds = 10

// pull in error types and the logic to handle them and set status codes
const errors = require('../../lib/custom_errors')

const BadParamsError = errors.BadParamsError
const BadCredentialsError = errors.BadCredentialsError

const User = require('../models/User')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `res.user`
const requireToken = passport.authenticate('bearer', {
	session: false,
})

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// SIGN UP
// POST /sign-up
router.post(
	'/sign-up',
	asyncErrorWrapper(async (req, res, next) => {
		// get and check credentials
		const credentials = req.body.credentials
		if (
			!credentials ||
			!credentials.username ||
			!credentials.password ||
			credentials.password !== credentials.password_confirmation
		) {
			throw new BadParamsError()
		}

		// await hash password
		const hash = await bcrypt.hash(
			req.body.credentials.password,
			bcryptSaltRounds
		)

		// await create user
		const user = await User.create({
			username: req.body.credentials.username,
			email: req.body.credentials.email,
			hashedPassword: hash,
		})
		// response
		res.status(201).json({ user: user.toObject() })
	})
)

// SIGN IN
// POST /sign-in
router.post(
	'/sign-in',
	asyncErrorWrapper(async (req, res, next) => {
		const pw = req.body.credentials.password

		// find user
		const user = await User.findOne({
			email: req.body.credentials.email,
		})

		// if no user
		if (!user) {
			throw new BadCredentialsError()
		}

		//compare passwords
		let compare_passwords = await bcrypt.compare(
			pw,
			user.hashedPassword
		)

		// if passwords correct
		if (compare_passwords) {
			// add token
			const token = crypto.randomBytes(16).toString('hex')
			user.token = token

			// save  user
			await user.save()
		} else {
			// if password wrong
			throw new BadCredentialsError()
		}

		// response
		res.status(201).json({ user: user.toObject() })
	})
)

// CHANGE password
// PATCH /change-password
router.patch(
	'/change-password',
	requireToken,
	asyncErrorWrapper(async (req, res, next) => {
		//get user
		let user = await User.findById(req.user.id)

		// check password to make sure the owner is right user
		let correctPassword = await bcrypt.compare(
			req.body.passwords.old,
			user.hashedPassword
		)

		if (!correctPassword || !req.body.passwords.new) {
			throw new BadParamsError()
		}

		//hash new password
		let newHashedPassword = await bcrypt.hash(
			req.body.passwords.new,
			bcryptSaltRounds
		)

		// change pwd
		user.hashedPassword = newHashedPassword

		//save user
		await user.save()

		// response
		res.sendStatus(204)
	})
)

router.delete(
	'/sign-out',
	requireToken,
	asyncErrorWrapper(async (req, res, next) => {
		// change user token
		req.user.token = await crypto.randomBytes(16).toString('hex')

		//save user
		await req.user.save()

		// response
		res.sendStatus(204)
	})
)

module.exports = router
