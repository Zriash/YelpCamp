const express = require('express');
const router = express.Router({ mergeParams: true });
const reviews = require('../controlers/reviews');
const { isLogin, validateReview, isReviewAuthor } = require('../middleware');

    
router.post('/',isLogin, validateReview, reviews.createReview);

router.delete('/:reviewId',isLogin, isReviewAuthor, reviews.deleteReview);

module.exports = router;