const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const review = require("./review")

const link = "https://a0.muscache.com/im/pictures/hosting/Hosting-U3RheVN1cHBseUxpc3Rpbmc6MTEzMTg2NzMzNDc0MDk1Nzg4NA%3D%3D/original/f39f4ad7-e951-464c-bfde-842e8ac3ea18.jpeg?im_w=720&im_q=highq"



const listingSchema = new Schema({
    title : {
        type :String,
        
    },
    description : String,
    image :{
        type : String,
        default :link,
        set : (v) => v===" " ? "link" : v, 
    },
    price :Number,
    location : String,
    country : String,
    reviews : [
        {
            type : mongoose.Schema.Types.ObjectId,
            ref : "reviews",
        }
    ],

})


listingSchema.post("findOneAndDelete" , async (listing) =>{
    if (listing ) {
        await review.deleteMany({_id :{ $in : listing.reviews}})
    }
})

const listing = mongoose.model("listing",listingSchema);
module.exports = listing;
