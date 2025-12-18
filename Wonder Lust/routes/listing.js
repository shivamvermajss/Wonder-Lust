const express = require("express");
const router = express.Router();
const wrapAsync= require( "../utils/wrapAsync.js");
const Listing = require( "../models/listing.js")
const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

const listingsController = require("../controllers/listings.js");






// new route
router.get("/new", isLoggedIn,(req,res)=>{
    if(!req.isAuthenticated()){
        req.flash("error","you must be logged in to create listing");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs")
});

// index route
router.get("/", wrapAsync( listingsController.index));

// show route

router.get("/:id", wrapAsync(async(req,res)=>{
    let{id}= req.params;
    const listing= await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } })
.populate("owner");

    if(!listing){
        req.flash("error", "Cannot find that listing!");
        return res.redirect("/listings");
    }
    res.render("listings/show.ejs", {listing});
}));

// create route
router.post("/", validateListing,isLoggedIn, wrapAsync(async (req, res) => {
  const newListing = new Listing(req.body.listing);
  newListing.owner= req.user._id;
  await newListing.save();
  req.flash("success", "Successfully made a new listing!");
  res.redirect("/listings");
}));

// edit route 
router.get("/:id/edit",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
        let{id}= req.params;
        const listing= await Listing.findById(id);
        if(!listing){
            req.flash("error", "Cannot find that listing!");
            return res.redirect("/listings");
        }
        res.render("listings/edit.ejs", {listing});


})); 

// update route
router.put("/:id",isLoggedIn,isOwner,validateListing ,wrapAsync(async(req,res)=>{
    
    let{id}= req.params;
    

    await Listing.findByIdAndUpdate(id,{...req.body.listing});
    req.flash("success", "Successfully updated listing!");
    res.redirect(`/listings/${id}`);

}));

// delete route
router.delete("/:id",isLoggedIn,isOwner, wrapAsync(async(req,res)=>{
    let{id}=req.params;
    let deletedListing= await Listing.findByIdAndDelete(id);
    console.log(deletedListing);
    req.flash("success", "Successfully deleted listing!");
    res.redirect("/listings");
}));


module.exports= router;