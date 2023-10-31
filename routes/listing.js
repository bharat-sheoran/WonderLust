const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const listingSchema = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");
const {isLoggedIn} = require("../middleware.js");
const {isOwner} = require("../middleware.js");

const validateListing = (req , resp , next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error);
    }else{
        next();
    }
}

//Index Route
router.get("/" ,wrapAsync(async (req , res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}));

//New Route
router.get("/new", isLoggedIn , (req , res)=>{
    res.render("listings/new.ejs");
});

//Insert Route
router.post("/", isLoggedIn , wrapAsync(async (req ,res ,next)=>{
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    await newListing.save();
    req.flash("success" , "New Post Created Successfully");
    res.redirect("/listing");
}));

//Show Route
router.get("/:id" , wrapAsync(async (req , res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate({path: "reviews" , populate: {path: "author"}}).populate("owner");
    if(!listing){
        req.flash("error" , "The Post you're trying to reach does'nt exist");
        res.redirect("/listing");
    }
    res.render("listings/show.ejs" , {listing});
}));

//Edit Route
router.get("/:id/edit", isLoggedIn, isOwner , async (req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash("error" , "The Post you're trying to reach does'nt exist");
        res.redirect("/listing");
    }
    res.render("listings/edit.ejs" , {listing});
});

//Update Route
router.put("/:id", isLoggedIn , isOwner , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body});
    req.flash("success" , "Post Edited Successfully");
    res.redirect(`/listing/${id}`);
}));

//Delete Route
router.delete("/:id", isLoggedIn, isOwner , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Post Deleted Successfully");
    res.redirect("/listing");
}));

module.exports = router;