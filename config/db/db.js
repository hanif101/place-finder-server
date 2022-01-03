'use strict'
// import NPM packages
const mongoose = require('mongoose')

// mongodb atlas connection
// use new version of URL parser
// use createIndex instead of deprecated ensureIndex
const db = () => {
	mongoose
		.connect(process.env.ATLAS_URI, {
			useNewUrlParser: true,
			useCreateIndex: true,
			useUnifiedTopology: true,
		})
		.then(console.log(':: MONGO_ATLAS connecttion successfull'))
		.catch(console.log)
}

module.exports = db
