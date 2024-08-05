const joi = require("joi")

module.exports.listingSchema = joi.object({
    listing : joi.object({
        title : joi.string().required(),
        description : joi.string().required(),
        image : joi.string().allow("",null),
        price : joi.number().required(),
        location : joi.string().required(),
        country : joi.string().required(),
        // reviews : joi.array(),
    }).required()

})

module.exports.reviewSchema = joi.object({
    review : joi.object({
        rating : joi.number().required().min(1).max(5),
        comment : joi.string().required(),
    }).required()
})