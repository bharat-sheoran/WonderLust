const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");
const listingSchema = require("./schema.js");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname , "/public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main().then(()=>{console.log("Connection to Database is Successfull")}).catch(()=>{console.log("Error in connecting Database")});

const validateListing = (req , resp , next)=>{
    const {error} = listingSchema.validate(req.body);
    if(error){
        throw new ExpressError(400 , error);
    }else{
        next();
    }
}

//Index Route
app.get("/listing" ,wrapAsync(async (req , res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
}));

//New Route
app.get("/listing/new" , (req , res)=>{
    res.render("listings/new.ejs");
});

//Insert Route
app.post("/listing", validateListing , wrapAsync(async (req ,res ,next)=>{
    await new Listing(req.body.listing).save();
    res.redirect("/listing");
}));

//Show Route
app.get("/listing/:id" , wrapAsync(async (req , res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});
}));

//Edit Route
app.get("/listing/:id/edit" , async (req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
});

//Update Route
app.put("/listing/:id", validateListing , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body});
    res.redirect(`/listing/${id}`);
}));

//Delete Route
app.delete("/listing/:id" , wrapAsync(async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
}));


// app.get("/testListing" , async (req , res)=>{
//     let sampleListing = new Listing({
//         title: "My New Villa",
//         description: "By The Beach",
//         price: 10000,
//         location: "Calungute, Goa",
//         country: "India"
//     });

//     await sampleListing.save();
//     console.log("Sample was Saved Successfully");
//     res.send("Data Inserted Succsessfully");
// });

app.get("/" , (req , res)=>{
    res.send("Welcome to Wonderlust");
});

app.all("*" , (req , res , next)=>{
    next(new ExpressError(404 , "Page Not Found"));
});

app.use((err , req , res , next)=>{
    let {status = 500 , message = "Something went Wrong!"} = err;
    res.status(status).render("error.ejs" , {message});
});

app.listen(port , ()=>{
    console.log(`App is listening at ${port}`);
});