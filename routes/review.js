const express = require("express");
const router = express.Router({mergeParams: true});

const Review = require("../models/review.js");
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const reviewSchema = require("../schema.js");

const validateReview = (req , resp , next)=>{
    const{error} = reviewSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error);
    }else{
        next();
    }
}

router.post("/", validateReview , wrapAsync(async (req ,res)=>{
    console.log(req.params.id);
    let newReview = await new Review(req.body.review);
    let listing = await Listing.findById(req.params.id);
    listing.reviews.push(newReview);
    await newReview.save();
    await listing.save();
    req.flash("success" , "Review Posted Successfully");
    res.redirect(`/listing/${req.params.id}`);
}));

//Delete Review
router.delete("/:rid" , wrapAsync(async(req , res)=>{
    let {id , rid} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull:{reviews: rid}});
    await Review.findByIdAndDelete(rid);
    req.flash("success" , "Review Deleted Successfully");
    res.redirect(`/listing/${id}`);
}));

module.exports = router;