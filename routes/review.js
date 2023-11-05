const express = require("express");
const router = express.Router({mergeParams: true});
const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const reviewSchema = require("../schema.js");
const {isLoggedIn , isReviewAuthor} = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

const validateReview = (req , resp , next)=>{
    const{error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error);
    }else{
        next();
    }
}

router.post("/", isLoggedIn , validateReview , wrapAsync(reviewController.newReview));

//Delete Review
router.delete("/:rid", isLoggedIn , isReviewAuthor ,wrapAsync(reviewController.deleteReview));

module.exports = router;