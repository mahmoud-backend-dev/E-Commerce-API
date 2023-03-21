const Review = require('../models/Review');

const {
    createOne,
    getOne,
    getAll,
    updateOne,
    deleteOne,
}=require('./handlerFactory')



// Nested Route
// POST api/v1/products/54546ad43sa8das5das/reviews
exports.setProductIdAndUserIdToBody = (req, res, next) => {
    if (req.params.productId)
        req.body.product = req.params.productId;
    if (!req.body.user)
        req.body.user = req.user._id
    next();
}


// Nested Route
// GET api/v1/products/54546ad43sa8das5das/reviews
exports.createFilterObject = (req,res,next) => {
    let filterObj = {};
    if (req.params.productId)
        filterObj = { product: req.params.productId };
    req.filterObj = filterObj;
    next();
}

//  Nested Route
// GET api/v1/products/54546ad43sa8das5das/reviews/sdad54656845da65sa


// @desc Create Review
// @route POST  /api/v1/reviews
// @access Private/Protect/User
exports.createReview = createOne(Review);

// @desc Get List Of Review
// @route GET   /api/v1/reviews
// @access public 
exports.getAllReviews = getAll(Review);

// @desc  Get Specific Review by id
// @route GET   /api/v1/reviews/:id
// @access private
exports.getReview = getOne(Review);


// @desc  Get Specific Review by id
// @route GET   /api/v1/reviews/:id
// @access Private/User
exports.updateReview = updateOne(Review);

// @desc  Delete Specific Review by id
// @route DELETE   /api/v1/reviews/:id
// @access Private/Protect/User-Admin-Manager
exports.deleteReview = deleteOne(Review);


