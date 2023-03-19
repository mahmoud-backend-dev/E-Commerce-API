const express = require('express');
const {
    createReview,
    getAllReviews,
    deleteReview,
    getReview,
    updateReview,
    createFilterObject,
    setProductIdAndUserIdToBody,
} = require('../controller/reviewController');
const router = express.Router({ mergeParams: true });
const {
    protect,
    allowedTo,
} = require('../controller/authController')

const {
    createReviewValidator,
    getReviewValidator,
    updateReviewValidator,
    deleteReviewValidator,
} = require('../utils/validators/reviewValidator');



router
router.route('/')
    .get(createFilterObject,getAllReviews)
    .post(
        protect,
        allowedTo("user"),
        setProductIdAndUserIdToBody,
        createReviewValidator,
        createReview
    );
router.route('/:id')
    .get(
        getReviewValidator,
        getReview
    )
    .put(
        protect,
        allowedTo("user"),
        updateReviewValidator,
        updateReview
    )
    .delete(
        protect,
        allowedTo("admin", "manager", "user"),
        deleteReviewValidator,
        deleteReview
    );

module.exports = router