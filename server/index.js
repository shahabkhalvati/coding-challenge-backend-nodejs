const express = require('express')
const bodyParser = require('body-parser')
const R = require('ramda')

const app = express()

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

const echo = (req, res) => {
  const { method, body, query } = req
  res.status(200).json(Object.assign({
    method,
    body
  }, R.isEmpty(query) ? {} : { query }))
}

app.use('/echo', echo)
app.get('/', (req, res) => res.sendStatus(200))

module.exports = app
