const Review = require("../models/review.js");
const Listing = require("../models/listing.js");

module.exports.newReview = async (req ,res)=>{
    let newReview = await new Review(req.body.review);
    let listing = await Listing.findById(req.params.id);
    listing.reviews.push(newReview);
    newReview.author = req.user._id;
    await newReview.save();
    await listing.save();
    req.flash("success" , "Review Posted Successfully");
    res.redirect(`/listing/${req.params.id}`);
}

module.exports.deleteReview = async(req , res)=>{
    let {id , rid} = req.params;
    await Listing.findByIdAndUpdate(id , {$pull:{reviews: rid}});
    await Review.findByIdAndDelete(rid);
    req.flash("success" , "Review Deleted Successfully");
    res.redirect(`/listing/${id}`);
}