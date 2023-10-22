const express = require("express");
const router = express.Router();

const wrapAsync = require("../utils/wrapAsync.js");
const listingSchema = require("../schema.js");
const ExpressError = require("../utils/ExpressError.js");
const Listing = require("../models/listing.js");

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
router.get("/new" , (req , res)=>{
    res.render("listings/new.ejs");
});

//Insert Route
router.post("/" , wrapAsync(async (req ,res ,next)=>{
    await new Listing(req.body.listing).save();
    req.flash("success" , "New Post Created Successfully");
    res.redirect("/listing");
}));

//Show Route
router.get("/:id" , wrapAsync(async (req , res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs" , {listing});
}));

//Edit Route
router.get("/:id/edit" , async (req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
});

//Update Route
router.put("/:id" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body});
    req.flash("success" , "Post Edited Successfully");
    res.redirect(`/listing/${id}`);
}));

//Delete Route
router.delete("/:id" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success" , "Post Deleted Successfully");
    res.redirect("/listing");
}));

module.exports = router;