const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require("./models/listing.js");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/wonderlust");
}

main().then(()=>{console.log("Connection to Database is Successfull")}).catch(()=>{console.log("Error in connecting Database")});


app.get("/testListing" , async (req , res)=>{
    let sampleListing = new Listing({
        title: "My New Villa",
        description: "By The Beach",
        price: 10000,
        location: "Calungute, Goa",
        country: "India"
    });

    await sampleListing.save();
    console.log("Sample was Saved Successfully");
    res.send("Data Inserted Succsessfully");
});

app.get("/" , (req , res)=>{
    res.send("Welcome to Wonderlust");
});

app.listen(port , ()=>{
    console.log(`App is listening at ${port}`);
});