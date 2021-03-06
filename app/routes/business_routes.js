/* eslint-disable no-tabs */
// require NPM packages
const express = require('express')
const passport = require('passport')
// const axios = require('axios')

// pull in Mongoose model for examples
const Business = require('../models/Business')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404

// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.
// { example: { title: '', text: 'foo' } } -> { example: { text: 'foo' } }
const removeBlanks = require('../../lib/remove_blank_fields')

// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', {
  session: false
})

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// INDEX
// GET / bsuiness
router.get('/business', requireToken, (req, res, next) => {
  Business.find()
    .populate('owner')
    .populate('reviews.owner')
    .then((businesses) => {
      // `examples` will be an array of Mongoose documents
      // we want to convert each one to a POJO, so we use `.map` to
      // apply `.toObject` to each one
      return businesses.map((business) => business.toObject())
    })
    // respond with status 200 and JSON of the examples
    .then((business) => res.status(200).json({ business }))
    // if an error occurs, pass it to the handler
    .catch(next)
})

// SHOW
// GET /business/:id
router.get('/business/:id', requireToken, (req, res, next) => {
  // req.params.id will be set based on the `:id` in the route
  Business.findById(req.params.id)
    .populate('reviews.owner')
    .populate('owner')
    .then(handle404)
  // if `findById` is succesful, respond with 200 and "example" JSON
    .then((business) =>
      res.status(200).json({ response: business.toObject() })
    )
  // if an error occurs, pass it to the handler
    .catch(next)
})

// CREATE
// POST / favorite-restaurants
router.post('/business', requireToken, (req, res, next) => {
  // set owner of new example to be current user
  req.body.business.owner = req.user.id

  Business.create(req.body.business)
  // respond to succesful `create` with status 201 and JSON of new "example"

    .then((business) => {
      res.status(201).json({ business })
    })
    // if an error occurs, pass it off to our error handler
    // the error handler needs the error message and the `res` object so that it
    // can send an error message back to the client
    .catch(next)
})

// // UPDATE
// // PATCH /examples/5a7db6c74d55bc51bdf39793
// router.patch(
// 	'/examples/:id',
// 	requireToken,
// 	removeBlanks,
// 	(req, res, next) => {
// 		// if the client attempts to change the `owner` property by including a new
// 		// owner, prevent that by deleting that key/value pair
// 		delete req.body.example.owner

// 		Example.findById(req.params.id)
// 			.then(handle404)
// 			.then((example) => {
// 				// pass the `req` object and the Mongoose record to `requireOwnership`
// 				// it will throw an error if the current user isn't the owner
// 				requireOwnership(req, example)

// 				// pass the result of Mongoose's `.update` to the next `.then`
// 				return example.updateOne(req.body.example)
// 			})
// 			// if that succeeded, return 204 and no JSON
// 			.then(() => res.sendStatus(204))
// 			// if an error occurs, pass it to the handler
// 			.catch(next)
// 	}
// )

// DESTROY
// DELETE /examples/5a7db6c74d55bc51bdf39793
router.delete('/business/:id', requireToken, (req, res, next) => {
  Business.findById(req.params.id)
    .then(handle404)
    .then((doc) => {
      console.log(doc)
      // throw an error if current user doesn't own `example`
      requireOwnership(req, doc)

      // delete the example ONLY IF the above didn't throw
      doc.deleteOne()
    })
    // send back 204 and no content if the deletion succeeded
    .then(() => res.sendStatus(204))
    // if an error occurs, pass it to the handler
    .catch(next)
})

module.exports = router
