const db = require('../../db/index.js');
const moment = require('moment');
const { max } = require('moment');


module.exports = {
    //TODO
    getReviews: (productId, count, page, sort, callback) => {
        if (page === undefined) {
            page = 1
        }
        if (count === undefined) {
            count = 5
        }
        if (sort === undefined) {
            sort = 'date'
        }
        db.query(`select * from reviews where product_id = ${productId} order by ${sort} desc limit ${count} offset ${(page-1)*count}`, (err, data) => {
            if (err) {
                console.log('there was an error in getReviews:', err.message)
            } else {
                callback(null, data)
            }
        })
    },

    getReviewPhotos: (prodId, callback) => {
        db.query(`select * from reviews_photos where review_id in (select id from reviews where product_id = ${prodId})`, (err, data) => {
            if (err) {
                console.log('there was an error in getReviewPhotos', err.message)
            } else {
                callback(null, data)
            }
        })
    },

    getCharacteristics: (productId, callback) => {
        db.query(`select * from characteristics where product_id = ${productId}`, (err, data) => {
            if (err) {
                console.log('there was an error in getCharacteristics:', err.message)
            } else {
                callback(null, data)
            }
        })
    },

    getCharReviewsForProd: (prodId, callback) => {
        db.query(`select * from characteristic_reviews where characteristic_id in (select id from characteristics where product_id = ${prodId})`, (err, data) => {
            if (err) {
                console.log('there was an error in getCharReviewsForProd:', err.message)
            } else {
                callback(null, data)
            }
        })
    },

    getCharReviews: (charId, callback) => {
        db.query(`select * from characteristic_reviews where characteristic_id = ${charId}`, (err, data) => {
            if (err) {
                console.log('there was an error in getCharReviews:', err.message)
            } else {
                callback(null, data)
            }
        })
    },

    postReview: (reviewObj, callback) => {
        var counter = 0
        var date = moment().format('YYYY-MM-DD')
        db.query(`insert into reviews(product_id,rating,date,summary,body,recommend,reported,reviewer_name,reviewer_email,response,helpfulness) values(${reviewObj.product_id},${reviewObj.rating},'${date}','${reviewObj.summary}','${reviewObj.body}',${reviewObj.recommend},0,'${reviewObj.name}','${reviewObj.email}',null,0)`, (err,data) => {
            if (err) {
                console.log('there was an error in postReview:', err.message)
            } else {
                db.query(`select max(id) from reviews`, (err, data) => {
                    if (err) {
                        console.log('there was an error in postReviewPhoto selecting last insert', err.message)
                    } else {
                        for (var i = 0; i < reviewObj.photos.length; i++) {
                            db.query(`insert into reviews_photos(url,review_id) values('${reviewObj.photos[i]}', ${data[0]['max(id)']})`, (err, data) => {
                                if (err) {
                                    console.log('there was an error in postReviewPhoto', err.message)
                                    callback(err)
                                } else {
                                    counter++
                                    if (counter === reviewObj.photos.length) {
                                        callback(null, 'success')
                                    }
                                }
                            })
                        }
                    }
                })
            }
        })
    },


    postCharReview: (charReviewObj, callback) => {
        db.query(`insert into characteristic_reviews(characteristic_id,review_id,value) values(${charReviewObj.characteristic_id},${charReviewObj.review_id},${charReviewObj.value})`, (err, data) => {
            if (err) {
                console.log('there was an error in postCharReviews:', err.message)
            } else {
                callback(null, data)
            }
        })
    },

    markHelpful: (reviewId, callback) => {
        db.query(`update reviews set helpfulness = helpfulness + 1 where id = ${reviewId}`, (err, data) => {
            if (err) {
                console.log('there was an error in markHelpful:', err.message)
            } else {
                callback(null, data)
            }
        })
    },

    report: (reviewId, callback) => {
        db.query(`update reviews set reported = 1 where id = ${reviewId}`, (err, data) => {
            if (err) {
                console.log('there was an error in markHelpful:', err.message)
            } else {
                callback(null, data)
            }
        })
    }
}