const express = require('express');
const bodyParser = require('body-parser');
const model = require('./models/models.js')
const control = require('./controllers/controllers.js')
const morgan = require('morgan')
const random = require('./random.js')

var app = express()

app.use(bodyParser.json())
app.use(morgan('dev'))

app.get('/reviews/meta', (req, res) => {
    // req.query.product_id = random.random
    control.getMeta(req, res)
    //TODO
})

app.get('/reviews', (req, res) => {
    control.getReviews(req, res)
    //TODO
    //how do I avoid hitting this when request is for meta
})

app.post('/reviews', (req, res) => {
    control.postReview(req, res)
    //TODO
})

app.put('/reviews/:review_id/helpful', (req, res) => {
    control.markHelpful(req, res)
    //TODO
})

app.put('/reviews/:review_id/report', (req, res) => {
    control.report(req, res)
})




app.listen(8000, () => {
    console.log('server is listening on port 8000!')
})