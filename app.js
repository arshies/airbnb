const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate")
const wrapAsync = require("./utils/wrapAsync")
const ExpressError = require("./utils/ExpressError")
const {listingSchema , reviewSchema} = require("./schema")

const listing = require("./models/listing");
const review = require("./models/review");
const mongoDB_URI = "mongodb://localhost:27017/wanderlust";

app.use(express.urlencoded({extended:true}))
app.use(express.json())
app.use(methodOverride("_method"))
app.set("view engine" , "ejs");
app.set("views" ,path.join(__dirname, "views"))

app.use(express.static(path.join(__dirname,"/public" )))
app.engine("ejs", ejsMate)

const validateListing = (req,res,next)=>{
    const {error} = listingSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next()
    }

}



const validateReview = (req,res,next)=>{
    const {error} = reviewSchema.validate(req.body);
    console.log(error);
    if(error){
        let errMsg = error.details.map((el) => el.message).join(",");
        throw new ExpressError(400,errMsg);
    }else{
        next()
    }

}



connect_mongoDB().then(() => {
    console.log(`mongoDB connected`);
}).catch((err) => console.log(`mongoDB connection error: ${err}`));


async function connect_mongoDB(){
    mongoose.connect(mongoDB_URI);
}


//checking localhost server
app.get("/", wrapAsync((req,res) => {
    const message = `server working properly on port ${port}`
    res.render("start.ejs", {message})
}))


//index route
app.get("/listing", wrapAsync(async (req,res) => {
    const allListing = await listing.find({});
    // console.log(allListing)
    res.render("./listing/index.ejs",{allListing})
}))

//new route
app.get("/listing/new", wrapAsync((req , res) => {
    res.render("./listing/new.ejs")
}))

//show route
app.get("/listing/:id", wrapAsync(async (req,res) => {
    const id = req.params.id;
    const singleListing = await listing.findById(id).populate("reviews");
    res.render("./listing/show.ejs",{singleListing});
}))


//edit route
app.get("/listing/:id/edit" , wrapAsync(async (req,res) =>{
    const id = req.params.id;
    const singleListing = await listing.findById(id);
    res.render("./listing/edit.ejs", {singleListing})
}))

//update route
app.put("/listing/:id",validateListing, wrapAsync(async (req,res) =>{
    if(!req.body.listing){
        throw new ExpressError(400,"send valid data")
    }
    let data = req.body.listing;
    let {id} = req.params;

    console.log(id);
    console.log(data);
    let singleListing = await listing.findByIdAndUpdate(id , {...req.body.listing})
    console.log(singleListing)
    res.render("./listing/show.ejs",{singleListing})
}))

//delete route
app.delete("/listing/:id", wrapAsync(async (req,res) =>{
    const {id} = req.params;
    await listing.findByIdAndDelete(id,{...req.body.listing})
    res.redirect("/listing")
}))

// create route
app.post("/listing",validateListing, wrapAsync(async (req,res) =>{
        
        const data = req.body.listing;
        console.log(data);
        const newList = await new listing(data);
        await newList.save();
        res.redirect("/listing")
}))

// review 
app.post("/listing/:id/review",validateReview ,wrapAsync( async (req, res) => {
    try {
        let newlisting = await listing.findById(req.params.id);
        let id = newlisting._id;
        if (!newlisting) {
            return res.status(404).send("Listing not found");
        }
 
        let newReview = new review(req.body.review);
 
        // Ensure reviews array exists
        if (!newlisting.reviews) {
            newlisting.reviews = [];
        }
 
        newlisting.reviews.push(newReview);
 
        await newlisting.save();
        await newReview.save();
       
        res.redirect(`/listing/${newlisting._id}`)
    } catch (error) {
        console.error(error);
        res.status(500).send("Server error");
    }
}));


//DELETE REVIEW
app.delete("/listing/:id/review/:reviewId" , async (req,res) =>{
    let {id , reviewId} = req.params;
    await review.findByIdAndDelete(reviewId);
    await listing.findByIdAndUpdate(id , {$pull : {reviews : reviewId} })
    res.redirect(`/listing/${id}`)
})

//error handling

app.all("*" ,(req,res,next) =>{
    next(new ExpressError(404,"Page Not Found"))
})

app.use((err,req,res,next) =>{
    let {status=500 , message="error found"} = err
    res.status(status).render("error.ejs",{message})
    console.log(err)
    // res.status(status).send(message)
})


app.listen(port , () =>{
    console.log(`server listening to port ${port}`);
})



// testing DB manipulation
// app.get("/testlisting", async (req,res) => {
//     let sampleListing = new listing({
//         title : "arshies",
//         description : "die",
//         price :10000,
//         location : "mumbai",
//         country : "india",
//     })

//     await sampleListing.save();
//     console.log(`sample saved`);
//     res.send(`data saved : ${sampleListing}`)
// })

