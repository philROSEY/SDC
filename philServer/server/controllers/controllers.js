const model = require('../models/models.js')

module.exports = {
    getReviews: (req, res) => {
        if (req.query.page === undefined) {
            req.query.page = 1
        }
        if (req.query.count === undefined) {
            req.query.count = 5
        }
        var resObj = {
            product: req.query.product_id,
            page: parseInt(req.query.page-1, 10),
            count: parseInt(req.query.count, 10),
            results: []
        }

        var addPhoto = (arr) => {
            for (var i = 0; i < arr.length; i++) {
                arr[i].photos = []
            }
        }

        var matchPhotos = (arr) => {
            for (let i = 0; i < arr.length; i++) {
                for (var j = 0; j < resObj.results.length; j++) {
                    if (arr[i].review_id === resObj.results[j].id) {
                        arr[i].review_id = undefined
                        resObj.results[j].photos.push(arr[i])
                    }
                }
            }
        }

        if (req.query.sort === 'newest') {
            var sort = 'date'
        }
        if (req.query.sort === 'helpful') {
            var sort = 'helpfulness'
        }
        if (req.query.sort === 'relevant') {
            var sort = 'date,helpfulness'
        }

        model.getReviews(req.query.product_id, req.query.count, req.query.page, sort, (err, data) => {
            if (err) {
                console.log('there was an error in getReviews controller:', err.message)
                res.sendStatus(500)
            } else {
                resObj.results = data.slice()
                addPhoto(data)
                model.getReviewPhotos(req.query.product_id, (err, data) => {
                    if (err) {
                        console.log('there was an error in getReviews getReviewPhotos')
                        res.sendStatus(500)
                    } else {
                        matchPhotos(data)
                        res.status(200).send(resObj)
                    }
                })
            }
        })
    },
    
    getMeta: (req, res) => {

        resObj = {
            product_id: req.query.product_id,
            ratings: {},
            recommended: {},
            characteristics: {}
        }

        var rateMeta = (arr) => {
            var ratings = {}
            var counter = 0
            for (var i = 0; i < arr.length; i++) {
                ratings[counter] = arr[i].rating
                counter+=1
            }
            resObj.ratings = ratings
        }

        var recoMeta = (arr) => {
            var recommended = {
                0: 0,
                1: 0 
            }
            for (var i = 0; i < arr.length; i++) {
                if (arr[i].recommend === 0) {
                    recommended[0] += 1
                }
                if (arr[i].recommend === 1) {
                    recommended[1] += 1
                }
            }
            resObj.recommended = recommended
        }

        var charMeta = (arr) => {
            var characteristics = {}
            for (var i = 0; i < arr.length; i++) {
                if (characteristics[arr[i].name] === undefined) {
                    characteristics[arr[i].name] = { id: arr[i].id }
                }
            }
            resObj.characteristics = characteristics
        }

        var fillChar = (arr) => {
            let newObj = arr.reduce((obj, element) => {
                if (!obj[element['characteristic_id']]) {
                  obj[element['characteristic_id']] = {
                    totalValue: element['value'],
                    counter: 1
                  }
                } else {
                  obj[element['characteristic_id']]['totalValue'] += element['value'];
                  obj[element['characteristic_id']]['counter']++;
                   obj[element['characteristic_id']]['average'] =  obj[element['characteristic_id']]['totalValue'] /  obj[element['characteristic_id']]['counter'];
                }
                return obj;
              }, {});
            for (var key in newObj) {
                for (var keyy in resObj.characteristics) {
                    if (key == resObj.characteristics[keyy].id) {
                        resObj.characteristics[keyy].value = newObj[key].average
                    }
                }
            }
        }

        model.getReviews(req.query.product_id, 50000000, 1, undefined, (err, data) => {
            if (err) {
                console.log('there was an error in getMeta controller:', err.message)
                res.sendStatus(500)
            } else {
                rateMeta(data)
                recoMeta(data)
                model.getCharacteristics(req.query.product_id, (err, data) => {
                    if (err) {
                        console.log('there was and error in getMeta getCharacteristics:', err.message)
                        res.sendStatus(500)
                    } else {
                        charMeta(data)
                        model.getCharReviewsForProd(req.query.product_id, (err, data) => {
                            if (err) {
                                console.log('there was an error in getMeta getcharreviews:', err.message)
                                res.sendStatus(500)
                            } else {
                                fillChar(data)
                                res.status(200).send(resObj)
                            }
                        })
                    }
                })
            }
        })
    },
    
    postReview: (req, res) => {
        model.postReview(req.body, (err, data) => {
            if (err) {
                res.sendStatus(500)
            } else {
                res.sendStatus(201)
            }
        })
    },


    
    markHelpful: (req, res) => {
        var review = parseInt(req.params.review_id, 10)
        model.markHelpful(review, (err, data) => {
            if (err) {
                res.sendStatus(500)
            } else {
                res.sendStatus(201)
            }
        })
    },
    
    report: (req, res) => {
        var review = parseInt(req.params.review_id, 10)
        model.report(review, (err, data) => {
            if (err) {
                res.sendStatus(500)
            } else {
                res.sendStatus(201)
            }
        })
    }
    
    
}
