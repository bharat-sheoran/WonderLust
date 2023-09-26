const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");
const path = require("path");
const ejs = require("ejs");
const methodOverride = require("method-override");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.static(path.join(__dirname , "/public")));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main().then(()=>{console.log("Connection to Database is Successfull")}).catch(()=>{console.log("Error in connecting Database")});

//Index Route
app.get("/listing" ,async (req , res)=>{
    const allListings = await Listing.find({});
    res.render("listings/index.ejs" , {allListings});
});

//New Route
app.get("/listing/new" , (req , res)=>{
    res.render("listings/new.ejs");
});

//Insert Route
app.post("/listing" , async (req ,res)=>{
    const {title , description , image , price , location , country} = req.body;
    let listing = new Listing({
        title: title,
        description: description,
        image: image,
        price: price,
        location: location,
        country: country
    });
    await listing.save();
    res.redirect("/listing");
});

//Show Route
app.get("/listing/:id" , async (req , res)=>{
    const {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/show.ejs" , {listing});
});

//Edit Route
app.get("/listing/:id/edit" , async (req , res)=>{
    let {id} = req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs" , {listing});
});

//Update Route
app.put("/listing/:id" , async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndUpdate(id , {...req.body});
    res.redirect(`/listing/${id}`);
});

//Delete Route
app.delete("/listing/:id" , async (req , res)=>{
    let {id} = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listing");
})


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

app.listen(port , ()=>{
    console.log(`App is listening at ${port}`);
});