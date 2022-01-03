// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')

// require database file
const db = require('./config/db/db')

// require configured passport authentication middleware
const auth = require('./lib/auth')

// require route files
// const exampleRoutes = require('./app/routes/example_routes')
const userRoutes = require('./app/routes/user_routes')
const restaurantRoutes = require('./app/routes/restaurant_routes')
const reviewRoutes = require('./app/routes/review_routes')

// require middleware
const errorHandler = require('./lib/error_handler')
const requestLogger = require('./lib/request_logger')

// establish dotenv config path
dotenv.config({ path: 'config/dotenv/config.env' })

// define server and client ports
// used for cors and local port declaration
const serverport = process.env.SERVER_PORT
// const clientport = process.env.CLIENT_PORT

// establish database connection
db()

// instantiate express application object
const app = express()

// set CORS headers on response from this API using the `cors` NPM package
// `CLIENT_ORIGIN` is an environment variable that will be set on Heroku

app.use(
	cors({
		origin:
			process.env.CLIENT_ORIGIN ||
			`http://localhost:${process.env.CLIENT_PORT}`,
	})
)

// register passport authentication middleware
app.use(auth)

// add `express.json` middleware which will parse JSON requests into
// JS objects before they reach the route files.
app.use(express.json())

// this parses requests sent by `$.ajax`, which use a different content type
app.use(express.urlencoded({ extended: true }))

// log each request as it comes in for debugging
app.use(requestLogger)

// routes
app.use(userRoutes)
app.use(restaurantRoutes)
app.use(reviewRoutes)

// register error handling middleware
app.use(errorHandler)

// run API on designated port (4741 in this case)
app.listen(process.env.PORT || serverport, () => {
	console.log(':: APP listening on port ' + process.env.PORT)
})

// needed for testing
module.exports = app
