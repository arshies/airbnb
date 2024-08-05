const mongoose = require("mongoose");
const initdata = require("./data");
const listing = require("../models/listing");

const mongoDB_URI = "mongodb://localhost:27017/wanderlust";

connect_mongoDB().then(() => {
    console.log(`mongoDB connected`);
}).catch((err) => console.log(`mongoDB connection error: ${err}`));


async function connect_mongoDB(){
    mongoose.connect(mongoDB_URI);
}

const init = async () => {
    await listing.deleteMany({});
    await listing.insertMany(initdata.data);
    console.log(`data added `);
}

init();