// require NPM packages
const express = require('express')
const store = require('../../config/store')
const axios = require('axios')
const asyncErrorWrapper = require('express-async-handler')

// pull in error types and the logic to handle them and set status codes
// const errors = require('../../lib/custom_errors')

// const BadParamsError = errors.BadParamsError
// const BadCredentialsError = errors.BadCredentialsError

// instantiate a router (mini app that only handles routes)
const router = express.Router()

// Businesses
router.post(
  '/yelp',
  asyncErrorWrapper(async (req, res, next) => {
    // get and check credentials

    const { term, zipcode } = req.body.data.credentials

    const URL = store.yelpUrl + `/search?term=${term}&location=${zipcode}&limit=20&/radius=1000`
    // const config = {
    //   headers: { Authorization: `Bearer ${store.yelpToken}` }
    // }

    const business = await axios.get({
      url: URL,
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-requested-with': 'xmlhttprequest',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${store.yelpToken}`
      }

    })

    // response
    res.status(201).json({ business: business.data })
  })
)

//  Reviews
router.get(
  '/yelp/:id',
  asyncErrorWrapper(async (req, res, next) => {
    // get and check credentials

    const { id } = req.params

    const URL = store.yelpUrl + `/${id}/reviews`
    // const config = {
    //   headers: { Authorization: `Bearer ${store.yelpToken}` }
    // }

    const business = await axios.get({
      url: URL,
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'x-requested-with': 'xmlhttprequest',
        'Access-Control-Allow-Origin': '*',
        'Authorization': `Bearer ${store.yelpToken}`
      }

    })
    // response
    res.status(201).json({ business: business.data })
  })
)

module.exports = router
