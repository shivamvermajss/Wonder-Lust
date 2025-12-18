const mongoose = require ("mongoose");
const initData = require ("./data.js");

const Listing = require("../models/listing.js");

main().then(()=>{
    console.log( " connected to db");
})
.catch((err)=>{
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/StaySphere')
} 

const initDb= async ()=>{
    await Listing.deleteMany({});
    initData.data=initData.data.map((obj) =>({...obj,owner:"6942b17cb172e42afd035d89"}))
    await Listing.insertMany(initData.data);
    console.log ( " data was initilized ");


}
initDb();

    