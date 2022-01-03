// require necessary NPM packages
const express = require('express')
const mongoose = require('mongoose')
const dotenv = require('dotenv')
const cors = require('cors')


// for test purpose

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

const SERVER_PORT = 3000
const CLIENT_PORT = 7165

// define server and client ports
// used for cors and local port declaration

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
			process.env.CLIENT_ORIGIN || `http://localhost:${CLIENT_PORT}`,
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
console.log(process.env.PORT)

// run API on designated port (4741 in this case)
app.listen(SERVER_PORT, () => {
	console.log(':: APP listening on port ' + SERVER_PORT)
})

// needed for testing
module.exports = app
